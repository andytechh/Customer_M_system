 <?php
 include_once("connection.php");

 header('Content-Type: application/json');
 header('Access-Control-Allow-Origin: http://localhost:5173');
 header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
 header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
 header('Access-Control-Allow-Credentials: true');


$res = ['error' => false];  
$action = $_POST['action'] ?? '';
switch ($action) {
  case 'viewProducts':
    viewProducts();
    break;
  case 'addtocart':
    addToCart();
    break;
  case 'updateProduct':
    updateProduct();
    break;
  case 'deleteProduct':
    error_log("Received POST data: " . print_r($_POST, true));
    if (isset($_POST['productId'])) {
        deleteProductAndReorder($_POST['productId']);
    } else {
        $res['error'] = true;
        $res['message'] = 'Product ID not provided.';
        echo json_encode($res);
    }
    break;
  default:
    $res['error'] = true;
    $res['message'] = 'Invalid action...';
    echo json_encode($res);
    break;
} 
 
function addToCart() {
  global $connect, $res;

  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input) $input = $_POST;

  $required = ['product_id', 'quantity', 'user_id'];
  foreach ($required as $field) {
      if (empty($input[$field])) {
          $res['error'] = true;
          $res['message'] = "Missing $field";
          echo json_encode($res);
          return;
      }
  }

  try {
      $connect->begin_transaction();

      // Check product exists
      $stmt = $connect->prepare("SELECT stocks FROM products WHERE product_id = ?");
      $stmt->bind_param("i", $input['product_id']);
      $stmt->execute();
      $product = $stmt->get_result()->fetch_assoc();

      if (!$product) throw new Exception('Product not found');
      if ($product['stocks'] < $input['quantity']) throw new Exception('Insufficient stock');

      // Add to cart
      $stmt = $connect->prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)");
      $stmt->bind_param("iii", $input['user_id'], $input['product_id'], $input['quantity']);
      $stmt->execute();

      // Update stock
      $stmt = $connect->prepare("UPDATE products SET stocks = stocks - ? WHERE product_id = ?");
      $stmt->bind_param("ii", $input['quantity'], $input['product_id']);
      $stmt->execute();

      $connect->commit();
      $res['message'] = 'Added to cart successfully';

  } catch (Exception $e) {
      $connect->rollback();
      $res['error'] = true;
      $res['message'] = $e->getMessage();
  }

  echo json_encode($res);
}
  ?>