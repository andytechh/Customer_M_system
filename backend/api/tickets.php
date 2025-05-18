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