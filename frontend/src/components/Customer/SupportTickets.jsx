import { useState, useEffect } from 'react';
import axios from 'axios';

const SupportTickets = () => {
const [tickets, setTickets] = useState([]);
const [subject, setSubject] = useState('');
const [message, setMessage] = useState('');
const [selectedTicket, setSelectedTicket] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const userId = localStorage.getItem('user_id');

// Fetch user's tickets
const fetchTickets = async () => {
try {
const res = await axios.get('http://localhost/Customer_M_system/backend/api/tickets.php?action=view_tickets');
const userTickets = res.data.tickets.filter(t => t.customer_id == userId);
setTickets(userTickets);
} catch (err) {
console.error('Error fetching tickets:', err);
}
};

// Submit new ticket
const createTicket = async () => {
if (!subject || !message) return alert('Please fill all fields.');

try {
  await axios.post('http://localhost/Customer_M_system/backend/api/tickets.php?action=create_ticket', {
  customer_id: parseInt(userId),
  subject,
  message
});
  alert('Ticket created successfully!');
  setSubject('');
  setMessage('');
  fetchTickets();
} catch (err) {
console.error('Error creating ticket:', err);
alert('Failed to create ticket.');
}
};

// Load replies for selected ticket
const loadReplies = async (ticket) => {
try {
const res = await axios.get(`http://localhost/Customer_M_system/backend/api/tickets.php?action=get_ticket_messages&ticket_id=${ticket.ticket_id}`);
if (!res.data.error) {
  setSelectedTicket({ ...ticket, messages: res.data.messages });
  setIsModalOpen(true);
}
} catch (err) {
  console.error('Failed to load replies:', err);
  alert('Could not load replies.');
}
};

useEffect(() => {
fetchTickets();
}, []);

return (
<div className="p-6 bg-gray-100 min-h-screen">
  <h2 className="text-2xl font-bold mb-4">Support Tickets</h2>

{/* Create Ticket Form */}
<div className="bg-white shadow rounded-lg p-6 mb-6">
  <h3 className="text-lg font-semibold mb-2">Create New Ticket</h3>
<input
  type="text"
  placeholder="Subject"
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
  className="w-full px-4 py-2 mb-4 border rounded"
/>
<textarea
  placeholder="Describe your issue..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  className="w-full px-4 py-2 mb-4 border rounded h-32"
/>
<button
  onClick={createTicket}
  className="btn-secondary"
  >
Submit Ticket
</button>
</div>

{/* Ticket List */}
<div className="bg-white shadow rounded-lg p-6">
<h3 className="text-lg font-semibold mb-4">Your Tickets</h3>
{tickets.length === 0 ? (
<p className="text-gray-500">No tickets found.</p>
) : (
<table className="min-w-full text-sm border-collapse border border-gray-300 rounded">
<thead className="bg-[#0E1336] text-white sticky rounded-2xl">
  <tr>
    <th className="px-4 py-2 text-left">Ticket ID</th>
    <th className="px-4 py-2 text-left">Subject</th>
    <th className="px-4 py-2 text-left">Status</th>
    <th className="px-4 py-2 text-left">Date Created</th>
    <th className="px-4 py-2 text-left">Action</th>
  </tr>
</thead>
<tbody>
  {tickets.map((ticket) => (
    <tr key={ticket.ticket_id} className="border-t hover:bg-gray-50 even:bg-gray-200">
      <td className="px-4 py-2">{ticket.ticket_id}</td>
      <td className="px-4 py-2">{ticket.subject}</td>
      <td className="px-4 py-2 capitalize">{ticket.status}</td>
      <td className="px-4 py-2">{new Date(ticket.created_at).toLocaleString()}</td>
      <td className="px-4 py-2">
        <button
          onClick={() => loadReplies(ticket)}
          className="btn-secondary rounded"
        >
          View Replies
        </button>
      </td>
    </tr>
  ))}
</tbody>
</table>
)}
</div>

{/* Modal for Viewing Replies */}
{isModalOpen && selectedTicket && (
<>
{/* Overlay */}
<div
className="fixed inset-0 z-40 bg-black bg-opacity-50"
onClick={() => setIsModalOpen(false)}
></div>

{/* Modal Content */}
<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-50">
<div className="bg-white rounded shadow-lg w-full max-w-xl max-h-[80vh] overflow-y-auto">
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-4">
      Ticket #{selectedTicket.ticket_id}
    </h3>
    <p className="mb-2">
      <strong>Subject:</strong> {selectedTicket.subject}
    </p>
    <p className="mb-4">
      <strong>Your Message:</strong>
    </p>
    <div className="border border-gray-300 p-4 rounded mb-6 bg-gray-50">
      {selectedTicket.message || "No message provided."}
    </div>

    <h4 className="font-medium mb-2">Admin Replies</h4>
    <div className="border border-gray-300 rounded p-4 h-64 overflow-y-auto bg-gray-50 mb-4">
      {selectedTicket.messages?.length > 0 ? (
        selectedTicket.messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 ${
              msg.sender_id === parseInt(userId)
                ? 'text-right'
                : 'text-left'
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.sender_id === parseInt(userId)
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-green-100 text-green-900'
              }`}
            >
              <strong>{msg.sender_id === parseInt(userId) ? 'Admin' : 'You'}</strong>
              <br />
              {msg.message}
              <small className="block mt-1 text-xs text-gray-500">
                {new Date(msg.created_at).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No replies yet.</p>
      )}
    </div>

    <div className="flex justify-end">
      <button
        onClick={() => setIsModalOpen(false)}
        className="btn-secondary px-4 py-2"
      >
        Close
      </button>
    </div>
  </div>
</div>
</div>
</>
)}
</div>
);
};

export default SupportTickets;