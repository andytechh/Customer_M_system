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
  case 'addProduct':
    addProduct();
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
    $res['message'] = 'Invalid action.';
    echo json_encode($res);
    break;
}
function deleteProductAndReorder($productId) {
    global $connect;

    $res = ['error' => false, 'message' => ''];

    $stmt = $connect->prepare("DELETE FROM products WHERE product_id = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $res['message'] = 'Product deleted successfully.';
    } else {
        $res['error'] = true;
        $res['message'] = 'Product not found or already deleted.';
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
    $productCreatedAt = $_POST['pcreated'] ?? null;
    $productImage = $_FILES['pimage'] ?? null;

    // Validate 
    if (
        empty($productName) || empty($productPrice) || empty($productStock) ||
        empty($productDescription) || empty($productCreatedAt) || empty($productImage)
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

                
    $query = "INSERT INTO products (pname, price, stocks, pdescription, available, p_image, created_at) 
              VALUES (?, ?, ?, ?, 1, ?, ?)";
    
    $stmt = mysqli_prepare($connect, $query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "sddsss", $productName, $productPrice, $productStock, $productDescription, $fileName, $productCreatedAt);

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

    $fieldsMap = [
        'pname' => 'pname',
        'price' => 'price',
        'pdescription' => 'pdescription',
        'pimage' => 'pimage',
        'available' => 'available',
        'stocks' => 'stocks'
    ];

    $fields = [];

    foreach ($fieldsMap as $inputKey => $dbColumn) {
        if (isset($_POST[$inputKey])) {
            $fields[] = "$dbColumn = '" . mysqli_real_escape_string($connect, $_POST[$inputKey]) . "'";
        }
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
        $res['message'] = 'Error updating product.';
        echo json_encode($res);
    }
}
?>
