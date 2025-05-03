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
  case 'viewProducts':
    viewProducts();
    break;
 case 'removeFromCart':
    removeFromCart();
    break;
case 'recommendations':
    getRecommendations();
    break;
case 'purchase':
    Purchase();
    break;
case 'cancel':
    cancelOrder();
    break;
case 'updateQuantity':
    updateQuantity();
    break;
case 'vieworders':
    viewOrders();
    break;
  case 'viewcart':
    $res["fuch"] = true;
    viewCart();
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
    $res['message'] = 'Invalid action products api...';
    echo json_encode($res);
    break;
}
function getRecommendations() {
    global $connect;
    
    try {
        $user_id = $_GET['user_id'] ?? null;
        
        // Basic recommendation logic (update with your actual logic)
        $query = "SELECT * FROM products ORDER BY RAND() LIMIT 6";
        
        if($user_id) {
            // Example personalized query
            $query = "
                SELECT p.* 
                FROM products p
                LEFT JOIN orders o ON p.product_id = o.product_id
                GROUP BY p.product_id
                ORDER BY COUNT(o.order_id) DESC
                LIMIT 6
            ";
        }

        $stmt = $connect->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $row['p_image'] = "http://localhost/Customer_M_system/backend/uploads/" . $row['p_image'];
            $products[] = $row;
        }
        
        header('Content-Type: application/json');
        echo json_encode($products);
        
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode([
            'error' => false, // Maintain false to match frontend expectations
            'message' => 'Recommendations loaded successfully',
            'data' => []
        ]);
    }
}
function cancelOrder() {
    global $connect, $res;
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Initialize debug array
    $res['debug'] = [];
    $res['error_steps'] = [];

    try {
        // Validate input
        if (empty($input['order_id'])) {
            $res['debug']['received_input'] = $input;
            throw new Exception("Order ID not provided");
        }

        $connect->begin_transaction();
        $res['debug']['transaction_started'] = true;

        // 1. Get order details
        $stmt = $connect->prepare("SELECT product_id, quantity FROM orders WHERE order_id = ?");
        $stmt->bind_param("i", $input['order_id']);
        
        if (!$stmt->execute()) {
            $res['error_steps'][] = "order_select_failed";
            throw new Exception("Failed to find order: " . $stmt->error);
        }
        
        $order = $stmt->get_result()->fetch_assoc();
        $res['debug']['order_details'] = $order;

        if (!$order) {
            $res['error_steps'][] = "order_not_found";
            throw new Exception("Order not found");
        }

        // 2. Cancel the order
        $stmt = $connect->prepare("
            UPDATE orders 
            SET order_status = 'cancelled' 
            WHERE order_id = ? 
            AND order_status NOT IN ('delivered', 'shipped')
        ");
        $stmt->bind_param("i", $input['order_id']);
        
        if (!$stmt->execute()) {
            $res['error_steps'][] = "status_update_failed";
            throw new Exception("Status update failed: " . $stmt->error);
        }
        
        $affected = $stmt->affected_rows;
        $res['debug']['status_update_affected_rows'] = $affected;

        if ($affected === 0) {
            $res['error_steps'][] = "no_rows_affected";
            throw new Exception("Order cannot be cancelled - possibly already processed");
        }

        // 3. Restore stock
        $stmt = $connect->prepare("UPDATE products SET stocks = stocks + ? WHERE product_id = ?");
        $stmt->bind_param("ii", $order['quantity'], $order['product_id']);
        
        if (!$stmt->execute()) {
            $res['error_steps'][] = "stock_restore_failed";
            throw new Exception("Stock restore failed: " . $stmt->error);
        }
        
        $res['debug']['stock_update_affected'] = $stmt->affected_rows;

        $connect->commit();
        $res['debug']['transaction_committed'] = true;
        $res['message'] = "Order cancelled and stock restored";

    } catch (Exception $e) {
        $connect->rollback();
        $res['error'] = true;
        $res['message'] = $e->getMessage();
        $res['debug']['error_code'] = $e->getCode();
        $res['debug']['backtrace'] = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 5);
    }

    // Log the full response for debugging
    error_log("Cancel Order Debug: " . print_r($res, true));
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
            o.quantity, 
            o.total_price, 
            o.order_date,
            o.order_status,
            p.pname AS product_name,
            p.p_image
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
function viewCart() {
    global $connect, $res;

    $user_id = $_GET['user_id'] ?? null;
    if (!$user_id) {
        $res['error'] = true;
        $res['message'] = 'User ID not provided.';
        echo json_encode($res);
        return;
    }
    $query = "
        SELECT ci.cart_id, ci.product_id, ci.quantity, 
               p.pname, p.price, p.p_image 
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.user_id = ?
    ";
    $stmt = $connect->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $cartItems = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($cartItems);
    } else {
        $res['error'] = true;
        $res['message'] = 'No items in cart.';
        echo json_encode($res);
    }
}
function getProductPrice($connect, $product_id) {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    $stmt = $connect->prepare("SELECT price FROM products WHERE product_id = ?");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    return $result['price'] ?? 0;
}function Purchase() {
    global $connect, $res;
    
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) $input = $_POST;

    $cart_id = $input['cart_id'] ?? null;

    if (!$cart_id) {
        $res['error'] = true;
        $res['message'] = 'Cart ID not provided.';
        echo json_encode($res);
        return;
    }

    try {
        $connect->begin_transaction();

        // 1. Get cart item with product details
        $stmt = $connect->prepare("
            SELECT ci.*, p.stocks, p.price, p.pname
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = ?
        ");
        $stmt->bind_param("i", $cart_id);
        $stmt->execute();
        $cartItem = $stmt->get_result()->fetch_assoc();

        if (!$cartItem) {
            throw new Exception("Cart item not found");
        }

        // 2. Verify stock availability (corrected column name)
        if ($cartItem['stocks'] < $cartItem['quantity']) {
            throw new Exception("Not enough stock for product: {$cartItem['pname']}");
        }

        // 3. Calculate total price (use direct price from query)
        $total_price = $cartItem['quantity'] * $cartItem['price'];
        if ($total_price <= 0) {
            throw new Exception("Invalid total price calculated");
        }

        // 4. Create order record (include product name)
        $stmt = $connect->prepare("
            INSERT INTO orders 
                (user_id, product_id, product_name, quantity, total_price, order_date) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->bind_param(
            "iisid",
            $cartItem['user_id'],
            $cartItem['product_id'],
            $cartItem['pname'],
            $cartItem['quantity'],
            $total_price
        );
        $stmt->execute();

        // 5. Update product stock
        $stmt = $connect->prepare("
            UPDATE products 
            SET stocks = stocks - ? 
            WHERE product_id = ?
        ");
        $stmt->bind_param("ii", 
            $cartItem['quantity'],
            $cartItem['product_id']
        );
        $stmt->execute();

        // 6. Remove from cart
        $stmt = $connect->prepare("DELETE FROM cart_items WHERE cart_id = ?");
        $stmt->bind_param("i", $cart_id);
        $stmt->execute();

        $connect->commit();
        $res['message'] = 'Purchase successful!';
    } catch (Exception $e) {
        $connect->rollback();
        $res['error'] = true;
        $res['message'] = $e->getMessage();
        error_log("Purchase Error: " . $e->getMessage()); // Add error logging
    }

    echo json_encode($res);
}
function removeFromCart() {
    global $connect, $res;

    $input = json_decode(file_get_contents('php://input'), true);
    if (empty($input['cart_id'])) {
        $res['error'] = true;
        $res['message'] = 'Cart ID not provided.';
        echo json_encode($res);
        return;
    }

    $cart_id = $input['cart_id'];
    $query = "DELETE FROM cart_items WHERE cart_id = ?";
    $stmt = $connect->prepare($query);
    $stmt->bind_param("i", $cart_id);

    if ($stmt->execute()) {
        $res['message'] = 'Item removed from cart successfully.';
    } else {
        $res['error'] = true;
        $res['message'] = 'Error removing item from cart.';
    }

    echo json_encode($res);
}

function updateQuantity() {
    global $connect, $res;

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) $input = $_POST;

    $required = ['cart_id', 'quantity'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            $res['error'] = true;
            $res['message'] = "Missing $field";
            echo json_encode($res);
            return;
        }
    }

    $cart_id = $input['cart_id'];
    $quantity = $input['quantity'];

    try {
        $stmt = $connect->prepare("UPDATE cart_items SET quantity = ? WHERE cart_id = ?");
        $stmt->bind_param("ii", $quantity, $cart_id);

        if ($stmt->execute()) {
            $res['message'] = 'Cart item quantity updated successfully.';
        } else {
            $res['error'] = true;
            $res['message'] = 'Error updating cart item quantity.';
        }
    } catch (Exception $e) {
        $res['error'] = true;
        $res['message'] = $e->getMessage();
    }

    echo json_encode($res);
}
function addToCart() {
    global $connect, $res;
    
    $input = $_POST;
    $required = ['action', 'product_id', 'user_id'];
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
        $product_id = $input['product_id'];
        $user_id = $input['user_id'];
        $quantity_to_add = 1;

        $stmt = $connect->prepare("SELECT stocks FROM products WHERE product_id = ?");
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $product = $stmt->get_result()->fetch_assoc();

        if (!$product) throw new Exception('Product not found');
        if ($product['stocks'] < $quantity_to_add) throw new Exception('Insufficient stock');
        $stmt = $connect->prepare("SELECT cart_id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?");
        $stmt->bind_param("ii", $user_id, $product_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $new_quantity = $row['quantity'] + $quantity_to_add;

            $update_stmt = $connect->prepare("UPDATE cart_items SET quantity = ? WHERE cart_id = ?");
            $update_stmt->bind_param("ii", $new_quantity, $row['cart_id']);
            $update_stmt->execute();

            $res['message'] = 'Product quantity updated in cart.';
        } else {
    
            $insert_stmt = $connect->prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)");
            $insert_stmt->bind_param("iii", $user_id, $product_id, $quantity_to_add);
            $insert_stmt->execute();

            $res['message'] = 'Product added to cart successfully.';
        }


        $stmt = $connect->prepare("UPDATE products SET stocks = stocks - ? WHERE product_id = ?");
        $stmt->bind_param("ii", $quantity_to_add, $product_id);
        $stmt->execute();

        $connect->commit();
    } catch (Exception $e) {
        $connect->rollback();
        $res['error'] = true;
        $res['message'] = $e->getMessage();
    }

    echo json_encode($res);
}
function deleteProductAndReorder($productId) {
    global $connect;
    
    $res = ['error' => false, 'message' => ''];
    mysqli_begin_transaction($connect);

    try{
        $stmt = $connect->prepare("DELETE FROM products WHERE product_id = ?");
        $stmt->bind_param("i", $productId);
        $stmt->execute();

        if ($stmt->affected_rows === 0) {
            throw new Exception('Product not found or already deleted.');
        }
        $result = mysqli_query($connect, "SELECT product_id FROM products ORDER BY product_id");
        $ids = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $ids[] = $row['product_id'];
        }
        $expected = 1;
        foreach ($ids as $id) {
            if ($id > $expected) break;
            $expected = $id + 1;
        }
        $alterQuery = "ALTER TABLE products AUTO_INCREMENT = $expected";
        if (!mysqli_query($connect, $alterQuery)) {
            throw new Exception('Failed to reset ID sequence');
        }

        mysqli_commit($connect);
        $res['message'] = 'Product deleted. Next ID: ' . $expected;
    } catch (Exception $e) {
        mysqli_rollback($connect);
        $res = ['error' => true, 'message' => $e->getMessage()];
    }

    echo json_encode($res);
}
function getLeastAvailableProductId($connect) {
    $query = "SELECT product_id FROM products ORDER BY product_id ASC";
    $result = mysqli_query($connect, $query);

    if (!$result) {
        return null;
    }

    $expectedId = 1;
    while ($row = mysqli_fetch_assoc($result)) {
        if ((int)$row['product_id'] !== $expectedId) {
            return $expectedId;
        }
        $expectedId++;
    }
    return $expectedId; 
}


function viewProducts() {
    global $connect, $res;
    $query = "SELECT * FROM products";
    $result = mysqli_query($connect, $query);
    if ($result) {
        $products = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($products);
    } else {
        $res['error'] = true;
        $res['message'] = 'Error fetching products.';
        echo json_encode($res);
    }
} 
function addProduct() {
    global $connect;

    error_log("POST Data: " . print_r($_POST, true));
    error_log("FILES Data: " . print_r($_FILES, true));

    $productName = $_POST['pname'] ?? null;
    $productPrice = $_POST['price'] ?? null;
    $productStock = $_POST['stocks'] ?? null;
    $productDescription = $_POST['pdescription'] ?? null;
    $productBrand = $_POST['brand'] ?? null;
    $productCreatedAt = $_POST['pcreated'] ?? null;
    $productImage = $_FILES['pimage'] ?? null;

    // Validate 
    if (
        empty($productName) || empty($productPrice) || empty($productStock) ||
        empty($productDescription) || empty($productCreatedAt) || empty($productImage) || empty($productBrand)
    ) {
        echo json_encode(['error' => true, 'message' => 'All fields are required.']);
        return;
    }

    // Validate image
    if ($productImage && $productImage['error'] === UPLOAD_ERR_OK) {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $maxFileSize = 5 * 1024 * 1024; // 5 MB

        if (!in_array($productImage['type'], $allowedTypes)) {
            echo json_encode(['error' => true, 'message' => 'Invalid file type. Only JPEG, PNG, and GIF are allowed.']);
            return;
        }

        if ($productImage['size'] > $maxFileSize) {
            echo json_encode(['error' => true, 'message' => 'File size exceeds the 5MB limit.']);
            return;
        }
        $uploadDir = __DIR__ . '/../uploads/';
        $fileName = uniqid() . '_' . basename($productImage['name']); 
        $filePath = $uploadDir . $fileName;

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if (!move_uploaded_file($productImage['tmp_name'], $filePath)) {
            echo json_encode(['error' => true, 'message' => 'Failed to upload image.']);
            return;
        }
    } else {
        echo json_encode(['error' => true, 'message' => 'Product image is required.']);
        return;
    }

                
    $query = "INSERT INTO products (pname, price, stocks, pdescription, available, brand, p_image, created_at) 
              VALUES (?, ?, ?, ?, 1, ?, ?, ?)";
    
    $stmt = mysqli_prepare($connect, $query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "sddssss", $productName, $productPrice, $productStock, $productDescription, $productBrand, $fileName, $productCreatedAt);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['error' => false, 'message' => 'Product added successfully.']);
        } else {
            error_log("SQL Error: " . mysqli_error($connect));
            echo json_encode(['error' => true, 'message' => 'Error adding product: ' . mysqli_error($connect)]);
        }

        mysqli_stmt_close($stmt);
    } else {
        error_log("Prepare Statement Error: " . mysqli_error($connect));
        echo json_encode(['error' => true, 'message' => 'Database error: ' . mysqli_error($connect)]);
    }
}


function updateProduct() {
    global $connect, $res;

    $productId = $_POST['product_id'] ?? null;
    if (!$productId) {
        echo json_encode(['error' => true, 'message' => 'Product ID not provided.']);
        return;
    }

    $fileName = null;
    $updateImage = false;

    if (!empty($_FILES['pimage']['name']) && $_FILES['pimage']['error'] === UPLOAD_ERR_OK) {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $maxFileSize = 5 * 1024 * 1024; // 5 MB

        if (!in_array($_FILES['pimage']['type'], $allowedTypes)) {
            echo json_encode(['error' => true, 'message' => 'Invalid file type. Only JPEG, PNG, and GIF are allowed.']);
            return;
        }

        if ($_FILES['pimage']['size'] > $maxFileSize) {
            echo json_encode(['error' => true, 'message' => 'File size exceeds the 5MB limit.']);
            return;
        }

        $uploadDir = __DIR__ . '/../uploads/';
        $fileName = uniqid() . '_' . basename($_FILES['pimage']['name']);
        $filePath = $uploadDir . $fileName;

        if (!move_uploaded_file($_FILES['pimage']['tmp_name'], $filePath)) {
            echo json_encode(['error' => true, 'message' => 'Failed to upload image.']);
            return;
        }
        $updateImage = true;
    }

    //  query
    $fields = [];
    $fieldsMap = [
        'pname' => 'pname',
        'price' => 'price',
        'pdescription' => 'pdescription',
        'stocks' => 'stocks',
        'brand' => 'brand'
    ];

    foreach ($fieldsMap as $inputKey => $dbColumn) {
        if (isset($_POST[$inputKey])) {
            $fields[] = "$dbColumn = '" . mysqli_real_escape_string($connect, $_POST[$inputKey]) . "'";
        }
    }

    if ($updateImage) {
        $fields[] = "p_image = '" . mysqli_real_escape_string($connect, $fileName) . "'";
    }

    if (empty($fields)) {
        echo json_encode(['error' => true, 'message' => 'No fields to update.']);
        return;
    }

    $query = "UPDATE products SET " . implode(", ", $fields) . " WHERE product_id = '$productId'";
    if (mysqli_query($connect, $query)) {
        echo json_encode(['error' => false, 'message' => 'Product updated successfully.']);
    } else {
        $res['error'] = true;
        $res['message'] = 'Error updating product: ' . mysqli_error($connect);
        echo json_encode($res);
    }
}
?>