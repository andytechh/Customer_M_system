import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {Bot} from 'lucide-react';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const userId = localStorage.getItem('user_id');
  const chatContainerRef = useRef(null);

  // Static messages shown on load
  const staticMessages = [
    { sender: 'bot', text: 'Hi there! How can we assist you today?' },
    { sender: 'bot', text: 'Feel free to ask about orders or support.'}
  ];

  // Quick reply options
  const quickOptions = [
    { label: "Order Status", intent: "order_status" },
    { label: "Return Policy", intent: "return_policy" },
    { label: "Billing Issue", intent: "billing_issue" },
    { label: "Talk to Admin", intent: "admin_ticket" }
  ];

  // Bot auto-replies based on intent
  const botReplies = {
    order_status: "To check your order status, please provide your order number.",
    return_policy: "Our return policy allows returns within 30 days of delivery.",
    billing_issue: "For billing issues, contact finance@yourstore.com",
    admin_ticket: "Connecting you with an agent..."
  };

  // Fetch messages from server
  const fetchMessages = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost/Customer_M_system/backend/api/indexLogin.php?action=get_messages&user_id=${userId}`
      );

      if (!res.data.error && Array.isArray(res.data.messages)) {
        const formatted = res.data.messages.map(msg => ({
          ...msg,
          isCustomer: parseInt(msg.sender_id) === parseInt(userId),
          key: msg.message_id || msg.sent_at
        }));

        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.message_id));
          const newMessages = formatted.filter(m => !existingIds.has(m.message_id));
          return [...prev, ...newMessages];
        });
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

const sendMessageToDB = async (text, intent = null) => {
  if (!text.trim()) return;

  const sender_id = parseInt(userId);
  const receiver_id = intent === "admin_ticket" ? 1 : 0;

  try {
    const response = await axios.post(
      'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=send_message',
      {
        sender_id,
        receiver_id,
        message: text,
        status: 'sent',
        ...(intent && { intent })
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      setMessages(prev => [
        ...prev,
        {
          message_id: response.data.message_id,
          message: text,
          isCustomer: true,
          sent_at: new Date().toISOString()
        }
      ]);
    }

  } catch (err) {
    console.error("Send failed:", err.response?.data || err.message);
    alert("Failed to send message");
  }
};
  const handleOptionClick = (option) => {
    const customerMsg = {
      sender_id: userId,
      message: option.label,
      intent: option.intent,
      sent_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, customerMsg]);

    setTimeout(() => {
      const reply = botReplies[option.intent];

      const botMsg = {
        sender_id: 0,
        message: reply,
        sent_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
      
      if (option.intent === "admin_ticket") {
        sendMessageToDB(reply, "admin_ticket"); // Save to DB
      }
    }, 600);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender_id: userId,
      message: input,
      intent: 'manual',
      sent_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageToDB(input); // Save to DB
    setInput('');
  };

  // Load initial messages and poll for updates
  useEffect(() => {
    const initialMessages = staticMessages.map((msg, idx) => ({
      ...msg,
      message_id: `static-${idx}`,
      sent_at: new Date().toISOString()
    }));

    setMessages(prev => prev.length === 0 ? initialMessages : prev);

    if (userId) {
      fetchMessages();

      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[700px] max-w-lg mx-auto border rounded-xl shadow-xl bg-white mt-8 font-sans overflow-hidden">
      
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-xl flex items-center gap-2">
        <Bot />
        <span className="font-semibold">AI Chatbot</span>
      </div>

      {/* Messages Container */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg, idx) => {
            const isCustomer = msg.isCustomer ?? parseInt(msg.sender_id) === parseInt(userId);
            const key = msg.message_id || msg.sent_at || idx;

            return (
              <div key={key} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    isCustomer 
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text || msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Quick Reply Buttons */}
      <div className="mt-2 grid grid-cols-2 gap-2 p-4 bg-white border-t">
        {quickOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 text-sm rounded transition duration-200"
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;