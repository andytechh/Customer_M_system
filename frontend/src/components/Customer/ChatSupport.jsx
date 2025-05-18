import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bot } from 'lucide-react';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const userId = localStorage.getItem('user_id');
  const chatContainerRef = useRef(null);

  const staticMessages = [
    { sender: 'bot', text: 'Hi there! How can we assist you today?' },
    { sender: 'bot', text: 'Feel free to ask about orders, billing, or support.' }
  ];
  const quickOptions = [
    { label: "Order Status", intent: "order_status" },
    { label: "Return Policy", intent: "return_policy" },
    { label: "Billing Issue", intent: "billing_issue" },
    { label: "Talk to Admin", intent: "admin_ticket" }
  ];
  const botReplies = {
    order_status: "To check your order status, please provide your order number.",
    return_policy: "Our return policy allows returns within 30 days of delivery.",
    billing_issue: "For billing issues, contact our finance team at finance@techzio.com",
    admin_ticket: "Connecting you with a live agent..."
  };

  const fetchMessages = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost/Customer_M_system/backend/api/indexLogin.php?action=get_messages&user_id=${userId}`
      );

      if (!res.data.error && Array.isArray(res.data.messages)) {
        const formatted = res.data.messages.map(msg => ({
          ...msg,
          isCustomer: parseInt(msg.sender_id) === parseInt(userId)
        }));

        setMessages(prev => {
          const existingMap = new Map(prev.map(m => [m.message_id, m]));
          const newMessages = formatted.filter(m => !existingMap.has(m.message_id));
          return [...prev, ...newMessages];
        });
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const sendMessageToDB = async (text, intent = null, receiver_id = 1) => {
    if (!text.trim()) return;

    const sender_id = parseInt(userId);
    const final_receiver_id = receiver_id || (intent === "admin_ticket" ? 1 : 0); // Admin ID = 1
 
    try {
      await axios.post(
        'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=send_message',
        JSON.stringify({
          sender_id,
          receiver_id: final_receiver_id,
          message: text,
          status: 'sent',
          ...(intent && { intent })
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (err) {
      alert("Failed to send message.");
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
        intent: option.intent,
        sent_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMsg]);

      if (option.intent === "admin_ticket") {
        sendMessageToDB(reply, "admin_ticket"); // Save
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
    sendMessageToDB(input); 
    setInput('');
  };

  // Load messages 
  useEffect(() => {
    const initialMessages = staticMessages.map((msg, idx) => ({
      ...msg,
      message_id: `static-${idx}`,
      sent_at: new Date().toISOString()
    }));

    setMessages(prev => prev.length === 0 ? initialMessages : prev);

    if (userId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // fcking fetch every 5 sec
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

return (
<div className="flex flex-col h-[700px] max-w-2xl mx-auto border rounded-xl shadow-xl bg-white mt-8 font-sans overflow-hidden">

<div className="bg-blue-600 text-white p-4 rounded-t-xl flex items-center relative gap-2">
  <Bot />
  <span className="font-semibold text-lg">AI Chatbot</span>
</div>

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

<div className="mt-2 grid grid-cols-2 gap-2 p-4 bg-white border-t">
  {quickOptions.map((option, index) => (
    <button
      key={index}
      onClick={() => handleOptionClick(option)}
      className="btn-secondary flex items-center justify-center p-2 rounded-lg hover:bg-gray-200 transition"
    >
      {option.label}
    </button>
  ))}
</div>

<div className="p-4 bg-white border-t">
  <div className="flex items-center space-x-2">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
      placeholder="Write a message"
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