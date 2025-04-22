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
    case 'viewUser':
        viewUser();
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
    case 'admin-login':
        admin_login();
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
 
function viewUser () {
    global $connect, $res;

    $user_Id = $_GET['user_id'] ?? null; 
    if (!$user_Id) {
        $res['error'] = true;
        $res['message'] = 'User  ID not provided.';
        echo json_encode($res);
        return;
    }

    $stmt = $connect->prepare("SELECT * FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_Id); 
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    
    if ($user = $result->fetch_assoc()) {
        echo json_encode(['error' => false, 'user' => $user]); 
    } else {
        echo json_encode(['error' => true, 'message' => 'User  not found']);
    }
}
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

function admin_login() {
    global $connect, $res;

    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $res['error'] = true;
        $res['message'] = 'Email and password are required.';
        echo json_encode($res);
        return;
    }

    $stmt = $connect->prepare("SELECT * FROM admins WHERE email = ? AND roles = 'admin'");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        if ($user && $password == $user['password_hash']) {
            $res['error'] = false;
            $res['message'] = 'Login successful.';
            $res['user'] = $user;
        } else {
            $res['error'] = true;
            $res['message'] = 'Invalid email or password.';
        }
    } else {
        $res['error'] = true;
        $res['message'] = 'Email not found or not an admin.';
    }

    echo json_encode($res);
}
function login() {
    global $connect, $res;

    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $res['error'] = true;
        $res['message'] = 'Email and password are required.';
        echo json_encode($res);
        return;
    }

    $stmt = $connect->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        if (password_verify($password, $user['password_hash'])) {
            $res['message'] = 'Login successful.';
            $res['user'] = $user;
        } else {
            $res['error'] = true;
            $res['message'] = 'Invalid password.';
        }
    } else {
        $res['error'] = true;
        $res['message'] = 'Email not found.';
    }

    echo json_encode($res);
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

    if (!$username || !$uemail || !$upassword) {
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
            echo json_encode(['type' => 'success', 'message' => 'User and customer registered']);
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Customer insert failed']);
        }
    } else {
        echo json_encode(['type' => 'error', 'message' => 'User insert failed']);
    }
}
?>
