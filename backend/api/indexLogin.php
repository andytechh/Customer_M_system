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
    case 'send_message':
        sendMessage();
        break;
    case 'get_messages':
        getMessagesByUser();
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

// Function to create a support ticket
function createTicket() {
    global $connect, $res;
    $data = json_decode(file_get_contents('php://input'), true);

    // Check for required fields
    if (!isset($data['customer_id'], $data['subject'], $data['message'])) {
        $res['error'] = true;
        $res['message'] = "Missing required fields.";
        echo json_encode($res);
        return;
    }

    error_log("Received ticket data: " . print_r($data, true));

    // Prepare insert statement
    $stmt = $connect->prepare("INSERT INTO tickets (customer_id, subject, message) VALUES (?, ?, ?)");
    if (!$stmt) {
        error_log("Prepare failed: (" . $connect->errno . ") " . $connect->error);
        $res['error'] = true;
        $res['message'] = "Database prepare error: " . $connect->error;
        echo json_encode($res);
        return;
    }

    // Bind values and execute
    $stmt->bind_param("iss", $data['customer_id'], $data['subject'], $data['message']);
    if ($stmt->execute()) {
        $res['message'] = "Ticket created successfully.";
    } else {
        error_log("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
        $res['error'] = true;
        $res['message'] = "Failed to create ticket: " . $stmt->error;
    }

    echo json_encode($res);
}

// Function to fetch messages exchanged between a user and admin
function getMessagesByUser() {
    global $connect;

    $userId = intval($_GET['user_id'] ?? 0);
    $adminId = 1; // Default admin ID

    if (!$userId) {
        echo json_encode(['error' => true, 'message' => 'User ID not provided.']);
        return;
    }

    // Fetch messages between user and admin
    $stmt = $connect->prepare("
        SELECT * FROM messages 
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
        ORDER BY sent_at ASC
    ");
    $stmt->bind_param("iiii", $userId, $adminId, $adminId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }

    echo json_encode(['error' => false, 'messages' => $messages]);
}

// Function to send a chat message
function sendMessage() {
    global $connect;

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['sender_id']) || !isset($data['receiver_id']) || !isset($data['message'])) {
        echo json_encode(['error' => true, 'message' => 'Missing required fields']);
        return;
    }

    $sender_id = intval($data['sender_id']);
    $receiver_id = intval($data['receiver_id']);
    $message = htmlspecialchars($data['message']);
    $status = $data['status'] ?? 'sent';
    $intent = isset($data['intent']) ? htmlspecialchars($data['intent']) : null;

    $stmt = $connect->prepare("
        INSERT INTO messages (sender_id, receiver_id, message, status, intent, sent_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");

    $stmt->bind_param("iisss", $sender_id, $receiver_id, $message, $status, $intent);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message_id' => $connect->insert_id,
            'sent_at' => date('Y-m-d H:i:s')
        ]);
    } else {
        error_log("Message insert failed: " . $connect->error);
        echo json_encode([
            'error' => true,
            'message' => 'Failed to save message: ' . $connect->error
        ]);
    }
}

// Function to return 6 random recommended products
function getRecommendations() {
    global $connect;

    $user_id = $_GET['user_id'] ?? null;

    try {
        // Fetch 6 random products
        $query = "SELECT * FROM products ORDER BY RAND() LIMIT 6";
        $stmt = $connect->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();

        $products = [];
        while ($row = $result->fetch_assoc()) {
            $row['image'] = "http://localhost/Customer_M_system/backend/uploads/" . $row['p_image'];
            $products[] = $row;
        }

        echo json_encode($products);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Function to fetch uname of user
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
    $query = "SELECT uname FROM users WHERE user_id = ?";
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
        error_log("No user found for user_id: " . $user_id);
        echo json_encode($res);
    }
}

// Function to update user's info
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

    // Prepare fields to update
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

    // Finalize update query
    $values[] = $userId;
    $types = str_repeat('s', count($values) - 1) . 'i';
    $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE user_id = ?";
    $stmt = $connect->prepare($sql);

    if (!$stmt) {
        echo json_encode(['error' => true, 'message' => 'Failed to prepare statement.']);
        return;
    }

    $stmt->bind_param($types, ...$values);

    // Execute and return result
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

// Function to get user details by ID
function testUser() {
    global $connect, $res;

    $user_Id = $_GET['user_id'] ?? null;

    if (!$user_Id) {
        $res['error'] = true;
        $res['message'] = 'User ID not provided.';
        echo json_encode($res);
        return;
    }

    $sql = $connect->prepare("SELECT * FROM users WHERE user_id = ?");
    $sql->bind_param("i", $user_Id);
    $sql->execute();
    $result = $sql->get_result();
    $sql->close();

    if ($user = $result->fetch_assoc()) {
        echo json_encode(['error' => false, 'user' => $user]);
    } else {
        echo json_encode(['error' => true, 'message' => 'User not found']);
    }
}

// Function to return all customers (users with role = 'customer')
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

// Function to log in a user or admin
function login() {
    global $connect, $res;

    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['error' => true, 'message' => 'Email and password are required.']);
        return;
    }

    // Check in admin table first
    $stmt = $connect->prepare("SELECT admin_id, email, password_hash, roles FROM admins WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($admin = $result->fetch_assoc()) {
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
            echo json_encode(['error' => true, 'message' => 'Invalid admin password.']);
            return;
        }
    }

    // Check in users table if not found in admin
    $stmt = $connect->prepare("SELECT user_id, username, email, password_hash, roles FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
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
            echo json_encode(['error' => true, 'message' => 'Invalid password.']);
            return;
        }
    }

    // User not found in both tables
    echo json_encode(['error' => true, 'message' => 'Email not found.']);
}

// Deletes a user and associated customer record from the database
function deleteUserAndReorder($userId) {
    global $connect, $res;

    // Delete from 'customers' where customer_id or user_id matches the given ID
    $stmt1 = $connect->prepare("DELETE FROM customers WHERE customer_id = ? OR user_id = ?");
    $stmt1->bind_param("ii", $userId, $userId); 
    $stmt1->execute();

    // Delete the corresponding user from the 'users' table
    $stmt2 = $connect->prepare("DELETE FROM users WHERE user_id = ?");
    $stmt2->bind_param("i", $userId);
    $stmt2->execute();

    // Check if any user row was affected (i.e., deleted)
    if ($stmt2->affected_rows > 0) {
        $res['message'] = 'User and customer deleted successfully.';
    } else {
        $res['error'] = true;
        $res['message'] = 'User not found or already deleted.';
    }

    // Send JSON response
    echo json_encode($res);
}
// Finds the next available user_id by detecting gaps in the 'users' table's user_id sequence
function getNextAvailableId($connect) {
    $query = "SELECT MIN(t1.user_id + 1) AS next_id
              FROM users t1
              WHERE NOT EXISTS (
                  SELECT 1 FROM users t2 WHERE t2.user_id = t1.user_id + 1
              )";
    $result = mysqli_query($connect, $query);

    // Return the first missing user_id (gap), if found
    if ($row = mysqli_fetch_assoc($result)) {
        return $row['next_id'];
    }

    // Return null if there are no gaps in the user_id sequence
    return null;
}

// Gets the next auto-increment value from the 'users' table
function getNextAutoIncrementId($connect) {
    $query = "SHOW TABLE STATUS LIKE 'users'";
    $result = mysqli_query($connect, $query);
    $row = mysqli_fetch_assoc($result);

    // Return the next auto-increment ID
    return $row['Auto_increment'];
}
// Registers a new user and creates a corresponding customer entry
function register() {
    global $connect;

    // Decode JSON data from the request body
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate JSON format
    if (!$data) {
        echo json_encode(['type' => 'error', 'message' => 'Invalid JSON']);
        return;
    }

    // Extract user fields or set to null if not provided
    $uname = $data['uname'] ?? null;
    $username = $data['username'] ?? null;
    $uemail = $data['uemail'] ?? null;
    $uaddress = $data['uaddress'] ?? null; 
    $upassword = $data['upassword'] ?? null;
    $ucreated_at = $data['ucreated'] ?? date('Y-m-d H:i:s');  // Default to now if not provided

    // Validate required fields
    if (!$username || !$uemail || !$upassword ) {
        echo json_encode(['type' => 'error', 'message' => 'Missing required fields']);
        return;
    }

    // Hash the password securely
    $hashedPassword = password_hash($upassword, PASSWORD_DEFAULT);

    // Try to get the next available (missing) user_id; fallback to auto-increment if none found
    $nextId = getNextAvailableId($connect);
    if ($nextId === null) {
        $nextId = getNextAutoIncrementId($connect);
    }

    // Prepare SQL insert for the 'users' table
    $stmt = $connect->prepare("
        INSERT INTO users (user_id, uname, username, email, uaddress, password_hash, created_at, roles)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'customer')
    ");
    if (!$stmt) {
        echo json_encode(['type' => 'error', 'message' => 'Failed to prepare statement']);
        return;
    }

    // Bind and execute user registration
    $stmt->bind_param("issssss", $nextId, $uname, $username, $uemail, $uaddress, $hashedPassword, $ucreated_at);

    if ($stmt->execute()) {
        $user_id = $nextId;

        // Also create a corresponding customer record
        $stmt2 = $connect->prepare("INSERT INTO customers (user_id, uname, uaddress) VALUES (?, ?, ?)");
        if (!$stmt2) {
            echo json_encode(['type' => 'error', 'message' => 'Failed to prepare customer statement']);
            return;
        }

        // Bind and execute customer insert
        $stmt2->bind_param("iss", $user_id, $uname, $uaddress);

        if ($stmt2->execute()) {
            // Return success with the new user_id
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
