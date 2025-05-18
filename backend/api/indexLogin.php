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
    case 'view':
        view();
        break;
    case 'recommendation':
        getRecommendations();
        break;
    case 'user':
        User();
    case 'viewUser':
        testUser();
        break;
    case 'create_ticket':
    createTicket();
    break;
    case 'login':
        login();
        break;
    case 'updateUser':
        updateUser();
        break;
    case 'register':
        register();
        break;
    case 'deleteUser':
            error_log("Received POST data: " . print_r($_POST, true));
            if (isset($_POST['userId'])) {
                deleteUserAndReorder($_POST['userId']);
            } else {
                $res['error'] = true;
                $res['message'] = 'User ID not provided.';
                echo json_encode($res);
            }
            break;
    default:
        $res['error'] = true;
        $res['message'] = 'Invalid action.';
        echo json_encode($res);
        break;
}

function getRecommendations() {
    global $connect;
    
    $user_id = $_GET['user_id'] ?? null;
    
     try {
        $defaultCategory = 'Desktop';
        
        $query = "
            SELECT * 
            FROM products 
            WHERE category = ?
            ORDER BY created_at DESC 
            LIMIT 6
        ";
        
        $stmt = $connect->prepare($query);
        $stmt->bind_param('s', $defaultCategory);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $row['p_image'] = "http://localhost/Customer_M_system/backend/uploads/" . $row['p_image'];
            $products[] = $row;
        }
        
        echo json_encode(['personalized' => $products]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
function User() {
    global $connect, $res;

    $user_id = $_GET['user_id'] ?? null;
    if (!$user_id) {
        $res['error'] = true;
        $res['message'] = 'User ID not provided.';
        echo json_encode($res);
        return;
    }

    error_log("Received user_id: " . $user_id); 
    $query = "
        SELECT uname
        FROM users
        WHERE user_id = ?
    ";
    $stmt = $connect->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode($user);
    } else {
        $res['error'] = true;
        $res['message'] = 'No user found...';
        error_log("No user found for user_id: " . $user_id); // failure
        echo json_encode($res);
    }
}
function updateUser() {
    global $connect, $res;

    $userId = $_POST['user_id'] ?? null;
    if (!$userId) {
        echo json_encode(['error' => true, 'message' => 'User ID not provided.']);
        return;
    }

    $fieldsMap = [
        'uname' => 'uname',
        'username' => 'username',
        'email' => 'email',
        'contacts' => 'contacts',
        'password' => 'password_hash',
        'status' => 'ustatus',
    ];

    $fields = [];
    $values = [];

    foreach ($fieldsMap as $input => $column) {
        if (!empty($_POST[$input])) {
            $value = $_POST[$input];

            if ($input === 'password') {
                $value = password_hash($value, PASSWORD_DEFAULT);
            }

            $fields[] = "$column = ?";
            $values[] = $value;
        }
    }

    if (empty($fields)) {
        echo json_encode(['error' => true, 'message' => 'No fields provided to update.']);
        return;
    }

    $values[] = $userId; 
    $types = str_repeat('s', count($values) - 1) . 'i';

    $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE user_id = ?";
    $stmt = $connect->prepare($sql);

    if (!$stmt) {
        echo json_encode(['error' => true, 'message' => 'Failed to prepare statement.']);
        return;
    }

    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['error' => false, 'message' => 'User updated successfully.']);
        } else {
            echo json_encode(['error' => true, 'message' => 'No changes made or user not found.']);
        }
    } else {
        echo json_encode(['error' => true, 'message' => 'Failed to update user.']);
    }

    $stmt->close();
}
//got it
function testUser(){
    global $connect, $res;
    
    $user_Id = $_GET['user_id'] ?? null; 

    if (!$user_Id) {
        $res['error'] = true;
        $res['message'] = 'User  ID not provided.';
        echo json_encode($res);
        return;
    }
    
    $user = json_decode(file_get_contents('php://input'));
    $sql = $connect->prepare("SELECT * FROM users WHERE user_id = ?");
    $sql->bind_param("i", $user_Id); 
    $sql->execute();
    $result = $sql->get_result();
    $sql->close();
    
    if ($user = $result->fetch_assoc()) {
        echo json_encode(['error' => false, 'user' => $user]); 
    } else {
        echo json_encode(['error' => true, 'message' => 'User  not found']);
    }
    
 
}
// function viewUser () {
//     global $connect, $res;

//     $user_Id = $_GET['user_id'] ?? null; 
   
//     if (!$user_Id) {
//         $res['error'] = true;
//         $res['message'] = 'User  ID not provided.';
//         echo json_encode($res);
//         return;
//     }
 
//     $stmt = $connect->prepare("SELECT * FROM users WHERE user_id = ?");
//     $stmt->bind_param("i", $user_Id); 
//     $stmt->execute();
//     $result = $stmt->get_result();
//     $stmt->close();
    
//     if ($user = $result->fetch_assoc()) {
//         echo json_encode(['error' => false, 'user' => $user]); 
//     } else {
//         echo json_encode(['error' => true, 'message' => 'User  not found']);
//     }
// }
function view() {
    global $connect;

    $stmt = $connect->prepare("SELECT * FROM users WHERE roles = 'customer'");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    
    $data = [];
   
    while ($user = $result->fetch_assoc()) {
        $data[] = $user;  
    }
    if (count($data) > 0) {
        echo json_encode(['error' => false, 'users' => $data]);
    } else {
        echo json_encode(['error' => true, 'message' => 'No customers found']);
    }
}
function login() {
    global $connect, $res;

    $email = trim($_POST['email'] ?? ''); 
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['error' => true, 'message' => 'Email and password are required.']);
        return;
    }
    error_log("Received email: " . $email);
    error_log("Received password: " . $password); 

    $stmt = $connect->prepare("SELECT admin_id, email, password_hash, roles FROM admins WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($admin = $result->fetch_assoc()) {
        error_log("Admin found. Verifying password...");
        if ($password == $admin['password_hash']) {
            echo json_encode([
                'error' => false,
                'message' => 'Login successful.',
                'user' => [
                    'user_id' => $admin['admin_id'],
                    'email' => $admin['email'],
                    'role' => $admin['roles']
                ]
            ]);
            return;
        } else {
            error_log("Admin password verification failed."); 
            echo json_encode(['error' => true, 'message' => 'Invalid admin password.']);
            return;
        }
    }
    $stmt = $connect->prepare("SELECT user_id, username, email, password_hash, roles FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        error_log("User found. Verifying password..."); 

        if (password_verify($password, $user['password_hash'])) {
            echo json_encode([
                'error' => false,
                'message' => 'Login successful.',
                'user' => [
                    'user_id' => $user['user_id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['roles']
                ]
            ]);
            return;
        } else {
            error_log("User password verification failed."); 
            echo json_encode(['error' => true, 'message' => 'Invalid password.']);
            return;
        }
    }
    error_log("Email not found in admins or users: " . $email); 
    echo json_encode(['error' => true, 'message' => 'Email not found.']);
}
function deleteUserAndReorder($userId) {
    global $connect, $res;

    $stmt1 = $connect->prepare("DELETE FROM customers WHERE customer_id = ? OR user_id = ?");
    $stmt1->bind_param("ii", $userId, $userId); 
    $stmt1->execute();

    $stmt2 = $connect->prepare("DELETE FROM users WHERE user_id = ?");
    $stmt2->bind_param("i", $userId);
    $stmt2->execute();

    if ($stmt2->affected_rows > 0) {
        $res['message'] = 'User and customer deleted successfully.';
    } else {
        $res['error'] = true;
        $res['message'] = 'User not found or already deleted.';
    }

    echo json_encode($res);
}
function getNextAvailableId($connect) {
    $query = "SELECT MIN(t1.user_id + 1) AS next_id
              FROM users t1
              WHERE NOT EXISTS (
                  SELECT 1 FROM users t2 WHERE t2.user_id = t1.user_id + 1
              )";
    $result = mysqli_query($connect, $query);
    if ($row = mysqli_fetch_assoc($result)) {
        return $row['next_id'];
    }
    return null;
}

function getNextAutoIncrementId($connect) {
    $query = "SHOW TABLE STATUS LIKE 'users'";
    $result = mysqli_query($connect, $query);
    $row = mysqli_fetch_assoc($result);
    return $row['Auto_increment'];
}

function register() {
    global $connect;

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(['type' => 'error', 'message' => 'Invalid JSON']);
        return;
    }
    $uname = $data['uname'] ?? null;
    $username = $data['username'] ?? null;
    $uemail = $data['uemail'] ?? null;
    $uaddress = $data['uaddress'] ?? null; 
    $upassword = $data['upassword'] ?? null;

    $ucreated_at = $data['ucreated'] ?? date('Y-m-d H:i:s'); 

    if (!$username || !$uemail || !$upassword ) {
        echo json_encode(['type' => 'error', 'message' => 'Missing required fields']);
        return;
    }
  
    $hashedPassword = password_hash($upassword, PASSWORD_DEFAULT);

    $nextId = getNextAvailableId($connect);
    if ($nextId === null) {
        $nextId = getNextAutoIncrementId($connect);
    }
    $stmt = $connect->prepare("
        INSERT INTO users (user_id, uname, username, email, uaddress, password_hash, created_at, roles)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'customer')
    ");
    if (!$stmt) {
        echo json_encode(['type' => 'error', 'message' => 'Failed to prepare statement']);
        return;
    }
    $stmt->bind_param("issssss", $nextId, $uname, $username, $uemail, $uaddress, $hashedPassword, $ucreated_at);

    if ($stmt->execute()) {
        $user_id = $nextId;

    
        $stmt2 = $connect->prepare("INSERT INTO customers (user_id, uname, uaddress) VALUES (?, ?, ?)");
        if (!$stmt2) {
            echo json_encode(['type' => 'error', 'message' => 'Failed to prepare customer statement']);
            return;
        }

        $stmt2->bind_param("iss", $user_id, $uname, $uaddress);

        if ($stmt2->execute()) {
            // Return success response with user_id
            echo json_encode([
                'type' => 'success',
                'message' => 'User and customer registered',
                'user_id' => $user_id 
            ]);
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Customer insert failed']);
        }
    } else {
        echo json_encode(['type' => 'error', 'message' => 'User insert failed']);
    }
}
?>
