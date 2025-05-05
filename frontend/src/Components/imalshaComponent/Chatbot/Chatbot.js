import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);

    try {
      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [
            ...messages.map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            })),
            { role: 'user', content: input }
          ]
        },
        {
          headers: {
            'Authorization': 'Bearer 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', // <-- Replace with your real key
            'Content-Type': 'application/json'
          }
        }
      );
      const botReply = response.data.choices[0].message.content;
      setMessages(msgs => [...msgs, { sender: 'bot', text: botReply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Sorry, there was an error connecting to DeepSeek.' }]);
    }
    setInput('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">AI Chatbot</div>
      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbot-message ${msg.sender}`}>{msg.text}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbot-input-area" onSubmit={handleSend}>
        <input
          className="chatbot-input"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="chatbot-send-btn" type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chatbot;