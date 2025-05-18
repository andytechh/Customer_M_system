import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {SendHorizontal } from 'lucide-react';

const AdminChat = () => {
const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [messages, setMessages] = useState([]);
const [input, setInput] = useState('');
const chatContainerRef = useRef(null);

const fetchCustomers = async () => {
try {
  const res = await axios.get(
  'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=view'
  );
      if (!res.data.error) {
      setUsers(res.data.users || []);
      }
    } catch (err) {
    console.error("Failed to load customers:", err);
    }
};
const fetchMessages = async (userId) => {
  try {
    const res = await axios.get(
    `http://localhost/Customer_M_system/backend/api/indexLogin.php?action=get_messages&user_id=${userId}`
    );

if (!res.data.error && Array.isArray(res.data.messages)) {
    const formatted = res.data.messages.map(msg => ({ ...msg, isAdmin: parseInt(msg.sender_id) === 1 // Assuming 
    }));
    setMessages(formatted);
    }
    } catch (err) {
    console.error("Failed to fetch messages:", err);
  }
};

// Send a fcking reply as admin
const sendAdminMessage = async () => {
if (!input.trim() || !selectedUser) return;

const sender_id = 1; 
const receiver_id = selectedUser.user_id;

try {
  await axios.post(
  'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=send_message',
  JSON.stringify({
    sender_id,
    receiver_id,
    message: input,
    status: 'sent'
}),
  {
  headers: {
    'Content-Type': 'application/json'
  }
  }
);

setInput('');
  fetchMessages(receiver_id); // Refresh messages
  } catch (err) {
  alert("Failed to send reply");
  }
};
 
useEffect(() => {
fetchCustomers();

const interval = setInterval(() => {
  if (selectedUser) {
  fetchMessages(selectedUser.user_id);
  }
}, 5000);
return () => clearInterval(interval);
}, []);
useEffect(() => {
  const container = chatContainerRef.current;
  if (container) {
  container.scrollTop = container.scrollHeight;
  }
  }, [messages]);

return (
<div className="flex h-[700px] max-w-7xl mx-auto border shadow-lg bg-white mt-8 font-sans overflow-hidden py-10 from-blue-100 to-indigo-50 bg-gradient-to-br rounded-2xl">
 <div className="w-70 border-r bg-gray-100 p-4 flex flex-col">
  <h2 className="text-lg font-bold mb-2">Customers Chat Support</h2>

<div className="flex-1 overflow-y-auto space-y-2">
{users.length === 0 ? (
  <p className="text-sm text-gray-500">No customers found.</p>
) : (
  users.map(user => (
    <div
      key={user.user_id}
      onClick={() => {
        setSelectedUser(user);
        fetchMessages(user.user_id);
      }}
      className={`cursor-pointer p-2 border rounded hover:bg-gray-200 ${
        selectedUser?.user_id === user.user_id ? 'bg-blue-100' : ''
      }`}
    >
      <p className="font-medium">{user.uname}</p>
      <p className="text-xs text-gray-500 truncate">{user.email}</p>
    </div>
  ))
)}
</div>
</div>

<div className="flex-1 flex flex-col border-l">
{selectedUser ? (
<>
  <div className="bg-blue-600 text-white p-3">
    <h2 className="font-semibold">{selectedUser.uname}</h2>
  </div>

  <div
    ref={chatContainerRef}
    className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
  >
    {messages.length === 0 ? (
      <p className="text-center text-gray-500">No messages yet.</p>
    ) : (
      messages.map((msg, idx) => {
        const isAdmin = msg.isAdmin;
        const key = msg.message_id || msg.sent_at || idx;

        return (
          <div key={key} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                isAdmin
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow'
              }`}
            >
              {msg.message}
            </div>
          </div>
        );
      })
  )}
  </div>
  <div className="p-3 bg-white border-t">
    <div className="flex items-center space-x-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendAdminMessage()}
        placeholder="Type a reply..."
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={sendAdminMessage}
        className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
      >
       <SendHorizontal />
      </button>
    </div>
  </div>
</>
) : (
<div className="flex-1 flex items-center justify-center text-gray-500">
  Select a customer to start chatting.
</div>
)}
</div>
</div>
);
};

export default AdminChat;