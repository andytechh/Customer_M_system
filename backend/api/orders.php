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
  case 'viewOrders':
    viewOrders();
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
    $res['message'] = 'Invalid action in orders...';
    echo json_encode($res);
    break;
} 

function deleteProductAndReorder($productId) {
  global $connect, $res;
  try {
      $connect->begin_transaction();

      // Delete the product from the database
      $stmt = $connect->prepare("DELETE FROM products WHERE product_id = ?");
      $stmt->bind_param("i", $productId);
      if (!$stmt->execute()) {
          throw new Exception('Failed to delete product: ' . $stmt->error);
      }

      // Reorder the products in the database
      $stmt = $connect->prepare("SET @row_number = 0; UPDATE products SET product_id = (@row_number := @row_number + 1) ORDER BY product_id;");
      if (!$stmt->execute()) {
          throw new Exception('Failed to reorder products: ' . $stmt->error);
      }

      $connect->commit();
      $res['message'] = 'Product deleted and reordered successfully.';
  } catch (Exception $e) {
      $connect->rollback();
      $res['error'] = true;
      $res['message'] = 'Error: ' . $e->getMessage();
  }
  echo json_encode($res);
}

function viewOrders() {
  global $connect;
  $user_id = $_GET['user_id'] ?? null;

  if (!$user_id) {
      echo json_encode(['error' => true, 'message' => 'User ID not provided']);
      return;
  }

  $stmt = $connect->prepare("
      SELECT 
          o.order_id, 
          o.product_id,
          p.pname AS product_name,
          p.p_image,
          o.quantity,
          o.total_price,
          o.order_status,
          o.order_date
      FROM orders o
      JOIN products p ON o.product_id = p.product_id
      WHERE o.user_id = ?
  ");
  $stmt->bind_param("i", $user_id);
  $stmt->execute();
  $result = $stmt->get_result();

  $orders = [];
  while ($row = $result->fetch_assoc()) {
      $row['p_image'] = "http://localhost/Customer_M_system/backend/uploads/" . $row['p_image'];
      $orders[] = $row;
  }

  echo json_encode($orders);
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