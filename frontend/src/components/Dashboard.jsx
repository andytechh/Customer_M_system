import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { SendHorizontal } from 'lucide-react';

Chart.register(...registerables);

const Dashboard = () => {
  // Metric state
  const [metrics, setMetrics] = useState({
    total_customers: 0,
    active_customers: 0,
    total_orders: 0,
    pending_orders: 0,
    revenue: 0,
    total_products: 0,
  });

  // Chat support state
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef(null);

  // Fetch dashboard metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost/Customer_M_system/backend/api/dashboard.php?action=get_metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };
    fetchMetrics();
  }, []);

  // Chat support functions
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=view'
      );
      if (!res.data.error) setUsers(res.data.users || []);
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
        const formatted = res.data.messages.map(msg => ({ 
          ...msg, 
          isAdmin: parseInt(msg.sender_id) === 1 
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const sendAdminMessage = async () => {
    if (!input.trim() || !selectedUser) return;
    try {
      await axios.post(
        'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=send_message',
        JSON.stringify({
          sender_id: 1,
          receiver_id: selectedUser.user_id,
          message: input,
          status: 'sent'
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
      setInput('');
      fetchMessages(selectedUser.user_id);
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  useEffect(() => {
    fetchCustomers();
    const interval = setInterval(() => {
      if (selectedUser) fetchMessages(selectedUser.user_id);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

return (
<div className="p-6">
{/* Metric Cards - 6 columns */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
{Object.entries(metrics).map(([key, value]) => (
  <div key={key} className="bg-white p-4 rounded-xl shadow-md flex flex-col min-h-[140px]">
    <h3 className="text-sm md:text-base font-medium text-gray-600 capitalize mb-2">
      {key.replace(/_/g, ' ')}
    </h3>
    <p className="mt-auto text-xl md:text-2xl font-bold text-gray-800">
      {key === 'revenue' ? 
        `₱${Number(value).toLocaleString('en-PH', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}` : 
        Number(value).toLocaleString('en-PH')
      }
    </p>
  </div>
))}
</div>

{/* Data Visualization Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
{/* Chat Support Panel */}
<div className="bg-white p-4 rounded-xl shadow-md h-[500px] flex flex-col">
<div className="flex h-full border bg-white overflow-hidden rounded-lg">
  <div className="w-48 md:w-64 border-r bg-gray-50 p-3 flex flex-col">
    <h2 className="text-base md:text-lg font-semibold mb-2">Customer Chats</h2>
    <div className="flex-1 overflow-y-auto space-y-1">
      {users.map(user => (
        <div
          key={user.user_id}
          onClick={() => {
            setSelectedUser(user);
            fetchMessages(user.user_id);
          }}
          className={`cursor-pointer p-2 text-sm border rounded-lg hover:bg-gray-100 ${
            selectedUser?.user_id === user.user_id ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
          }`}
        >
          <p className="font-medium truncate">{user.uname}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      ))}
    </div>
  </div>
<div className="flex-1 flex flex-col">
  {selectedUser ? (
    <>
      <div className="bg-blue-600 text-white p-3">
        <h2 className="font-medium text-sm md:text-base">{selectedUser.uname}</h2>
      </div>
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
              msg.isAdmin 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-800 shadow-sm border'
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-white border-t">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendAdminMessage()}
            placeholder="Type message..."
            className="flex-1 p-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={sendAdminMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 rounded-lg flex items-center justify-center transition"
          >
            <SendHorizontal size={16} />
          </button>
        </div>
      </div>
    </>
  ) : (
    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
      Select a customer to chat
    </div>
  )}
</div>
</div>
</div>

{/* Order Statistics Chart */}
<div className="bg-white p-4 rounded-xl shadow-md h-[500px]">
  <h2 className="text-lg font-semibold mb-3">Order Overview</h2>
  <div className="h-[calc(100%-40px)]">
    <Bar
      data={{
        labels: ['Pending', 'Completed', 'Revenue'],
        datasets: [{
          label: 'Count/Amount',
          data: [
            metrics.pending_orders,
            metrics.total_orders - metrics.pending_orders,
            metrics.revenue
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(54, 162, 235, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return Number(value).toLocaleString('en-PH');
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toLocaleString('en-PH');
                  if(context.label === 'Revenue') label = `₱${label}`;
                }
                return label;
              }
            }
          }
        }
      }}
    />
  </div>
</div>
</div>
</div>
);
};

export default Dashboard;