import React, { useEffect, useState} from 'react';
import axios from 'axios';

const AdminTicketsPage = () => {
const [tickets, setTickets] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedTicket, setSelectedTicket] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [newMessage, setNewMessage] = useState('');
const [messages, setMessages] = useState([]);

// Fetch all tickets
const fetchTickets = async () => {
try {
  const res = await axios.get('http://localhost/Customer_M_system/backend/api/tickets.php?action=view_tickets');
  if (!res.data.error) {
  setTickets(res.data.tickets || []);
  } }
 catch (err) {
  console.error("Error fetching tickets:", err);
  } finally {
setLoading(false);
}
};

// Load ticket 
const viewTicket = async (ticket) => {
  try {
  const res = await axios.get(`http://localhost/Customer_M_system/backend/api/tickets.php?action=get_ticket_messages&ticket_id=${ticket.ticket_id}`);
  if (!res.data.error) {
  setMessages(res.data.messages);
  } else {
  setMessages([]);
  }
  setSelectedTicket(ticket);
  setIsModalOpen(true);
  } catch (err) {
  console.error("Failed to load ticket:", err);
  alert("Could not load ticket.");
  }
};

//admin reply to ticket
const sendMessage = async () => {
if (!newMessage.trim()) return;

  try {
  const response = await axios.post(
  'http://localhost/Customer_M_system/backend/api/tickets.php?action=send_ticket_message',
  {
  ticket_id: selectedTicket.ticket_id,
  sender_id: 1, // Admin ID
  message: newMessage
  }, {
  headers: { 'Content-Type': 'application/json' }
  }
 );

if (!response.data.error) {
  setNewMessage('');
  fetchTicketMessages(); // Refresh
  } else {
  alert("Failed to send reply.");
  }
  } catch (err) {
  console.error("Send error:", err);
  alert("Network error.");
  }
};

// Refresh ticket messages
const fetchTicketMessages = async () => {
  try { const res = await axios.get(`http://localhost/Customer_M_system/backend/api/tickets.php?action=get_ticket_messages&ticket_id=${selectedTicket.ticket_id}`);
  if (!res.data.error) {
  setMessages(res.data.messages || []);
  }
  } catch (err) {
  console.error("Failed to load messages:", err);
  }
};

// Handle status change
const handleStatusChange = async (newStatus) => {
  if (!selectedTicket) return;
    try {
    const response = await axios.post(
    'http://localhost/Customer_M_system/backend/api/tickets.php?action=update_ticket',
    {
    ticket_id: selectedTicket.ticket_id,
    status: newStatus
    },
    {
    headers: { 'Content-Type': 'application/json' }
    }
);

  if (!response.data.error) {
   // alert("Ticket status updated successfully.");
    fetchTickets();
    setSelectedTicket({ ...selectedTicket, status: newStatus });
    } else {
    alert("Failed to update ticket status.");
    }
    } catch (err) {
    console.error("Status update error:", err);
    alert("Network error.");
    }
};

useEffect(() => {
fetchTickets();
}, []);

return (
<div className="py-10 from-blue-100 to-indigo-50 bg-gradient-to-br rounded-2xl h-screen">
  <h2 className="text-2xl font-bold mb-4 px-3">Admin Dashboard - Support Tickets</h2>

{loading ? (
<p className="text-gray-500">Loading tickets...</p>
) : tickets.length === 0 ? (
<p className="text-gray-500">No tickets found.</p>
) : (
<>
<table className="min-w-full text-sm border-collapse border border-gray-300 p-3 rounded">
  <thead className="bg-[#0E1336] text-white sticky top-0">
    <tr>
      <th className="px-4 py-2 text-center">Ticket ID</th>
      <th className="px-4 py-2 text-left">Customer Name</th>
      <th className="px-4 py-2 text-left">Subject</th>
      <th className="px-4 py-2 text-left">Status</th>
      <th className="px-4 py-2 text-left">Date Created</th>
      <th className="px-4 py-2 text-left">Action</th>
    </tr>
  </thead>
  <tbody>
    {tickets.map((ticket) => (
      <tr key={ticket.ticket_id} className="border-b bg-white even:bg-gray-100">
        <td className="px-4 py-2 text-center">{ticket.ticket_id}</td>
        <td className="px-4 py-2">{ticket.customer_name}</td>
        <td className="px-4 py-2">{ticket.subject}</td>
        <td className="px-4 py-2 capitalize">{ticket.status}</td>
        <td className="px-4 py-2">{new Date(ticket.created_at).toLocaleString()}</td>
        <td className="px-4 py-2">
          <button
            onClick={() => viewTicket(ticket)}
            className="btn-secondary"
          >
            View
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

{/* Modal */}
{isModalOpen && selectedTicket && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl max-h-[80vh] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-2">
        Ticket #{selectedTicket.ticket_id} - {selectedTicket.customer_name}
      </h3>
      <p className="mb-2">
        <strong>Status:</strong> {selectedTicket.status}
      </p>
      <p className="mb-2">
        <strong>Subject:</strong> {selectedTicket.subject}
      </p>
      <p className="mb-2">
        <strong>Customer Message:</strong>
      </p>
      <div className="border border-gray-300 p-3 rounded mb-4 bg-gray-50">
        {selectedTicket.message || "No message provided."}
      </div>

      <label className="block mb-4">
        <span className="block mb-1">Change Status</span>
        <select
          value={selectedTicket.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full border-gray-300 rounded p-2"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </label>

      <hr className="my-4" />
      <h4 className="font-medium mb-2">Conversation</h4>
      <div className="border border-gray-300 rounded p-3 mb-4 h-64 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500">No replies yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 ${
                msg.sender_id === 1 ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender_id === 1
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-green-100 text-green-900'
                }`}
              >
                <strong>{msg.sender_id === 1 ? 'Admin' : msg.sender_name}</strong>
                <br />
                {msg.message}
                <small className="block mt-1 text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Admin Reply Box */}
      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your reply..."
        className="w-full p-2 border border-gray-blue rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#1CB5E0]"
      />
      <div className="flex gap-2">
        <button
          onClick={sendMessage}
          className="btn-secondary "
        >
          Send Reply
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="btn-secondary"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
</>
)}
</div>
);
};

export default AdminTicketsPage;