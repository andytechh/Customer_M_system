<?php
include_once("connection.php");

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

$res = ['error' => false];  
$action = $_GET['action'] ?? '';
switch ($action) {
  case 'get_recommendations':
    getRecommendations();
    break;
  default:
    $res['error'] = true;
    $res['message'] = 'Invalid action in recommendations...';
    echo json_encode($res);
    break; 
}
function fetchByCategory() {
    global $connect;
    $category = $_GET['category'] ?? '';
    $stmt = $connect->prepare("SELECT * FROM products WHERE category = ?");
    $stmt->bind_param("s", $category);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $row['p_image'] = handleImage($row['p_image']);
        $products[] = $row;
    }
    echo json_encode($products);
}

function fetchRandom() {
    global $connect;
    $exclude = $_GET['exclude'] ?? '';
    $limit = $_GET['limit'] ?? 4;
    
    $query = "SELECT * FROM products";
    if ($exclude) $query .= " WHERE category != '$exclude'";
    $query .= " ORDER BY RAND() LIMIT $limit";
    
    $result = $connect->query($query);
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $row['p_image'] = handleImage($row['p_image']);
        $products[] = $row;
    }
    echo json_encode($products);
}

function handleImage($image) {
    if (is_resource($image)) {
        $blob = stream_get_contents($image);
        return "data:image/jpeg;base64,".base64_encode($blob);
    }
    return $image;
}
function getRecommendations() {
global $connect;
try {
    $stmt = $connect->prepare("
        (SELECT *, 'personalized' AS recommendation_type 
        FROM products 
        WHERE category = 'Desktop'
        ORDER BY created_at DESC 
        LIMIT 6)
        
        UNION
        
        (SELECT *, 'fallback' AS recommendation_type
        FROM products 
        WHERE category != 'Desktop'
        ORDER BY RAND()
        LIMIT 6)
        
        LIMIT 6
    ");
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $products = [];
    while ($row = $result->fetch_assoc()) {
        if (is_resource($row['p_image'])) {
            $blob = stream_get_contents($row['p_image']);
            $row['p_image'] = "data:image/jpeg;base64,".base64_encode($blob);
        } else {
            $row['p_image'] = "http://localhost/Customer_M_system/backend/uploads/".rawurlencode($row['p_image']);
        }
        $products[] = $row;
    }
    shuffle($products);
    
    echo json_encode([
        'personalized' => array_slice($products, 0, 6),
        'trending' => [],
        'new' => []
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
}
 ?>