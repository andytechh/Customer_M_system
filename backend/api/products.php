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
case 'updateQuantity':
    updateQuantity();
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
    $res['message'] = 'Invalid action...';
    echo json_encode($res);
    break;
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