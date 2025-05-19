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
     case 'send_message':
        sendMessage();
        break;
    case 'get_messages':
        getMessagesByUser();
        break;
    case 'create_ticket':
        createTicket();
        break;
    case 'view_tickets':
        viewTickets();
        break;
    case 'update_ticket':
        updateTicket();
        break;
    case 'get_ticket_messages':
        getTicketMessages();
        break;
    case 'send_ticket_message':
        sendTicketMessage();
    break;
    default:
        $res['error'] = true;
        $res['message'] = "Invalid action.";
        echo json_encode($res);
        break;
}
function sendMessage() {
    global $connect;
    
    $data = json_decode(file_get_contents('php://input'), true);
    $required = ['sender_id', 'receiver_id', 'message'];
    
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            echo json_encode(['error' => true, 'message' => "$field is required"]);
            return;
        }
    }

    try {
        $stmt = $connect->prepare("
            INSERT INTO messages 
            (sender_id, receiver_id, message, status, intent, sent_at)
            VALUES (?, ?, ?, 'sent', ?, NOW())
        ");
        
        $stmt->bind_param("iiss", 
            $data['sender_id'],
            $data['receiver_id'],
            $data['message'],
            $data['intent'] ?? null
        );
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message_id' => $stmt->insert_id
            ]);
        } else {
            throw new Exception('Failed to send message');
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => $e->getMessage()]);
    }
}

function getMessagesByUser() {
    global $connect;
    
    $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
    $adminId = 1; // Your admin user ID

    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => 'User ID required']);
        return;
    }

    try {
        $stmt = $connect->prepare("
            SELECT * FROM messages 
            WHERE (sender_id = ? AND receiver_id = ?)
               OR (sender_id = ? AND receiver_id = ?)
            ORDER BY sent_at ASC
        ");
        
        // User <-> Admin conversation
        $stmt->bind_param("iiii", $userId, $adminId, $adminId, $userId);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $messages = [];
        
        while ($row = $result->fetch_assoc()) {
            $messages[] = [
                'message_id' => $row['message_id'],
                'sender_id' => $row['sender_id'],
                'receiver_id' => $row['receiver_id'],
                'message' => htmlspecialchars($row['message']),
                'sent_at' => $row['sent_at'],
                'status' => $row['status'],
                'intent' => $row['intent']
            ];
        }
        
        echo json_encode(['messages' => $messages]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => $e->getMessage()]);
    }
}
function getTicketMessages() {
    global $connect;

    $ticket_id = intval($_GET['ticket_id'] ?? 0);

    if (!$ticket_id) {
        echo json_encode(['error' => true, 'message' => 'Ticket ID not provided']);
        return;
    }

    $stmt = $connect->prepare("
        SELECT tm.*, u.uname AS sender_name 
        FROM ticket_messages tm
        JOIN users u ON tm.sender_id = u.user_id
        WHERE tm.ticket_id = ?
        ORDER BY tm.created_at ASC
    ");
    $stmt->bind_param("i", $ticket_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }

    echo json_encode(['error' => false, 'messages' => $messages]);
}
function sendTicketMessage() {
    global $connect;

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['ticket_id'], $data['sender_id'], $data['message'])) {
        echo json_encode(['error' => true, 'message' => 'Missing required fields']);
        return;
    }

    $ticket_id = intval($data['ticket_id']);
    $sender_id = intval($data['sender_id']);
    $message = htmlspecialchars($data['message']);

    $stmt = $connect->prepare("INSERT INTO ticket_messages (ticket_id, sender_id, message) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $ticket_id, $sender_id, $message);

    if ($stmt->execute()) {
        echo json_encode(['error' => false, 'message' => 'Reply sent successfully']);
    } else {
        echo json_encode(['error' => true, 'message' => 'Failed to send reply']);
    }
}
function createTicket() {
    global $connect, $res;

    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);

    if (!isset($data['customer_id'], $data['subject'], $data['message'])) {
        $res['error'] = true;
        $res['message'] = "Missing required fields.";
        echo json_encode($res);
        return;
    }

    $stmt = $connect->prepare("INSERT INTO tickets (customer_id, subject, message) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $data['customer_id'], $data['subject'], $data['message']);

    if ($stmt->execute()) {
        $res['message'] = "Ticket created successfully.";
    } else {
        $res['error'] = true;
        $res['message'] = "Failed to create ticket.";
    }

    echo json_encode($res);
}

function viewTickets() {
    global $connect;
    $result = $connect->query("
        SELECT t.*, u.uname AS customer_name 
        FROM tickets t
        JOIN users u ON t.customer_id = u.user_id
        ORDER BY t.created_at DESC
    ");

    $tickets = [];
    while ($row = $result->fetch_assoc()) {
        $tickets[] = $row;
    }

    echo json_encode(['error' => false, 'tickets' => $tickets]);
}

function updateTicket() {
    global $connect, $res;

    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);

    if (!isset($data['ticket_id'], $data['status'])) {
        $res['error'] = true;
        $res['message'] = "Ticket ID or status missing.";
        echo json_encode($res);
        return;
    }

    $stmt = $connect->prepare("UPDATE tickets SET status = ? WHERE ticket_id = ?");
    $stmt->bind_param("si", $data['status'], $data['ticket_id']);

    if ($stmt->execute()) {
        $res['message'] = "Ticket updated.";
    } else {
        $res['error'] = true;
        $res['message'] = "Failed to update ticket.";
    }

    echo json_encode($res);
}
?>