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

function getMetrics() {
    global $connect;

    $metrics = [];
   
    // Total Customers
    $stmt = $connect->prepare("SELECT COUNT(*) as total_customers FROM users WHERE roles = 'customer'");
    $stmt->execute();
    $metrics['total_customers'] = $stmt->get_result()->fetch_assoc()['total_customers'] ?? 0;

     // Total Products
    $stmt = $connect->prepare("SELECT COUNT(*) as total_products FROM products");
    $stmt->execute();
    $result = $stmt->get_result();
    $metrics['total_products'] = $result->fetch_assoc()['total_products'] ?? 0;
    
    // Active Customers
    $stmt = $connect->prepare("SELECT COUNT(*) as active_customers FROM users WHERE roles = 'customer'");
    $stmt->execute();
    $metrics['active_customers'] = $stmt->get_result()->fetch_assoc()['active_customers'] ?? 0;

    // Total Orders
    $stmt = $connect->prepare("SELECT COUNT(*) as total_orders FROM orders");
    $stmt->execute();
    $metrics['total_orders'] = $stmt->get_result()->fetch_assoc()['total_orders'] ?? 0;

    // Pending Orders
    $stmt = $connect->prepare("SELECT COUNT(*) as pending_orders FROM orders WHERE order_status = 'pending'");
    $stmt->execute();
    $metrics['pending_orders'] = $stmt->get_result()->fetch_assoc()['pending_orders'] ?? 0;

    // Revenue
    $stmt = $connect->prepare("SELECT COALESCE(SUM(total_price), 0) as revenue FROM orders");
    $stmt->execute();
    $metrics['revenue'] = round($stmt->get_result()->fetch_assoc()['revenue'], 2);

    echo json_encode($metrics);
    exit;
}

function getChartData() {
    global $connect;
    
    $data = [
        'dates' => [],
        'pending_orders' => [],
        'completed_orders' => []
    ];

    // Get last 7 days including today
    for ($i = 6; $i >= 0; $i--) {
        $date = date('Y-m-d', strtotime("-$i days"));
        $data['dates'][] = $date;

        // Pending orders (status = pending)
        $stmt = $connect->prepare("SELECT COUNT(*) as pending 
                                  FROM orders 
                                  WHERE order_status = 'pending' 
                                  AND DATE(order_date) = ?");
        $stmt->bind_param('s', $date);
        $stmt->execute();
        $result = $stmt->get_result();
        $data['pending_orders'][] = $result->fetch_assoc()['pending'] ?? 0;

        // Completed orders (status = delivered)
        $stmt = $connect->prepare("SELECT COUNT(*) as completed 
                                  FROM orders 
                                  WHERE order_status = 'delivered' 
                                  AND DATE(order_date) = ?");
        $stmt->bind_param('s', $date);
        $stmt->execute();
        $result = $stmt->get_result();
        $data['completed_orders'][] = $result->fetch_assoc()['completed'] ?? 0;
    }

    echo json_encode($data);
    exit;
}
?>