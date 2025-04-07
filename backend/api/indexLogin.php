<?php
include_once("connection.php");

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

$res = ['error' => false];
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'login':
        login();
        break;
    case 'register':
        register();
        break;
    case 'deleteUser':
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

function login() {
    global $connect, $res;

    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $res['error'] = true;
        $res['message'] = 'Email and password are required.';
        echo json_encode($res);
        exit;
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

    echo json_encode($res); // <- always send a response
}

function deleteUserAndReorder($userId) {
    global $connect, $res;

    // Step 1: Delete the user from the database
    $stmt = $connect->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Step 2: Reorder the IDs
        $stmt = $connect->prepare("SET @count = 0;");
        $stmt->execute();

        $stmt = $connect->prepare("UPDATE users SET id = @count := @count + 1 ORDER BY id;");
        $stmt->execute();

        // Step 3: Reset AUTO_INCREMENT
        $stmt = $connect->prepare("ALTER TABLE users AUTO_INCREMENT = 1;");
        $stmt->execute();

        $res['message'] = 'User deleted and IDs reordered successfully.';
    } else {
        $res['error'] = true;
        $res['message'] = 'Failed to delete the user.';
    }

    echo json_encode($res);
}
function getNextAvailableId($connect) {
    $query = "SELECT MIN(user_id + 1) AS next_id FROM users WHERE user_id + 1 NOT IN (SELECT user_id FROM users)";
    $result = mysqli_query($connect, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        return $row['next_id'];
    } else {
        return null; // No gaps, so the next available ID will be the highest current ID + 1
    }
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

    if ($data) {
        $uname = $data['uname'];
        $username = $data['username'];
        $uemail = $data['uemail'];
        $upassword = $data['upassword'];
        $ucreated_at = $data['ucreated'];

        $nextId = getNextAvailableId($connect);
        if ($nextId === null) {
        
            $nextId = getNextAutoIncrementId($connect);
        }

        if ($username && $uemail && $upassword) {
            // Insert the new user with the smallest available ID
            $stmt = $connect->prepare("INSERT INTO users (user_id, uname, username, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)");
            if ($stmt === false) {
                echo json_encode(['type' => 'error', 'message' => 'Failed to prepare statement']);
                exit;
            }
            $stmt->bind_param("isssss", $nextId, $uname, $username, $uemail, $upassword, $ucreated_at);

            if ($stmt->execute()) {
                echo json_encode(['type' => 'success', 'message' => 'User inserted successfully']);
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Failed to insert user']);
            }
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Invalid input']);
        }
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Invalid JSON']);
    }
}

?>
