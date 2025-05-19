<?php
include_once("connection.php");

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$res = ['error' => false];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_metrics':
        getMetrics();
        break;
    case 'get_chart_data':
        getChartData();
        break;
    default:
        $res['error'] = true;
        $res['message'] = 'Invalid action.';
        echo json_encode($res);
        break;
}

// Fetch dashboard summary metrics (counts and revenue)
function getMetrics() {
    global $connect;

    $metrics = []; // Initialize result array

    // 1. Total number of customers
    $stmt = $connect->prepare("SELECT COUNT(*) as total_customers FROM users WHERE roles = 'customer'");
    $stmt->execute();
    $metrics['total_customers'] = $stmt->get_result()->fetch_assoc()['total_customers'] ?? 0;

    // 2. Total number of products
    $stmt = $connect->prepare("SELECT COUNT(*) as total_products FROM products");
    $stmt->execute();
    $result = $stmt->get_result();
    $metrics['total_products'] = $result->fetch_assoc()['total_products'] ?? 0;

    // 3. Number of active customers (currently same as total customers)
    $stmt = $connect->prepare("SELECT COUNT(*) as active_customers FROM users WHERE roles = 'customer'");
    $stmt->execute();
    $metrics['active_customers'] = $stmt->get_result()->fetch_assoc()['active_customers'] ?? 0;

    // 4. Total number of orders
    $stmt = $connect->prepare("SELECT COUNT(*) as total_orders FROM orders");
    $stmt->execute();
    $metrics['total_orders'] = $stmt->get_result()->fetch_assoc()['total_orders'] ?? 0;

    // 5. Total number of pending orders
    $stmt = $connect->prepare("SELECT COUNT(*) as pending_orders FROM orders WHERE order_status = 'pending'");
    $stmt->execute();
    $metrics['pending_orders'] = $stmt->get_result()->fetch_assoc()['pending_orders'] ?? 0;

    // 6. Total revenue (sum of total_price for all orders)
    $stmt = $connect->prepare("SELECT COALESCE(SUM(total_price), 0) as revenue FROM orders");
    $stmt->execute();
    $metrics['revenue'] = round($stmt->get_result()->fetch_assoc()['revenue'], 2); // Round to 2 decimals

    // Return metrics as JSON
    echo json_encode($metrics);
    exit;
}

// Fetch chart data for the past 7 days (pending and completed orders)
function getChartData() {
    global $connect;
    
    // Initialize structure for chart data
    $data = [
        'dates' => [],
        'pending_orders' => [],
        'completed_orders' => []
    ];

    // Loop through the past 7 days (including today)
    for ($i = 6; $i >= 0; $i--) {
        $date = date('Y-m-d', strtotime("-$i days"));
        $data['dates'][] = $date;

        // 1. Count pending orders for this date
        $stmt = $connect->prepare("SELECT COUNT(*) as pending 
                                   FROM orders 
                                   WHERE order_status = 'pending' 
                                   AND DATE(order_date) = ?");
        $stmt->bind_param('s', $date);
        $stmt->execute();
        $result = $stmt->get_result();
        $data['pending_orders'][] = $result->fetch_assoc()['pending'] ?? 0;

        // 2. Count completed orders (delivered) for this date
        $stmt = $connect->prepare("SELECT COUNT(*) as completed 
                                   FROM orders 
                                   WHERE order_status = 'delivered' 
                                   AND DATE(order_date) = ?");
        $stmt->bind_param('s', $date);
        $stmt->execute();
        $result = $stmt->get_result();
        $data['completed_orders'][] = $result->fetch_assoc()['completed'] ?? 0;
    }

    // Return chart data as JSON
    echo json_encode($data);
    exit;
}
?>