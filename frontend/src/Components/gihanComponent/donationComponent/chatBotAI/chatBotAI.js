import React, { useState, useRef, useEffect } from "react";

const ChatBotAI = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I am your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const userMsg = { sender: "user", text: input };
      setMessages(prev => [...prev, userMsg]);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { sender: "ai", text: `AI: ${input}` }
        ]);
      }, 500);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 60 }}>
      <div style={{ width: "100%", maxWidth: 480, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.10)", padding: 0, display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        <div style={{ width: "100%", display: "flex", alignItems: "center", padding: "18px 24px 10px 24px", borderBottom: "1px solid #eee", background: "#f5f8ff", borderRadius: "16px 16px 0 0" }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#333", fontWeight: 600 }}>AI Chatbot</h2>
        </div>
        <div style={{ flex: 1, padding: 24, overflowY: "auto", minHeight: 300, maxHeight: 340, background: "#f9fafd", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              padding: "10px 16px",
              borderRadius: 16,
              maxWidth: "80%",
              wordBreak: "break-word",
              fontSize: "1rem",
              marginBottom: 2,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "#e6f0ff" : "#f0f1f6",
              color: msg.sender === "user" ? "#1a237e" : "#333"
            }}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 24px 0 24px", borderTop: "1px solid #eee" }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            style={{ flex: 1, border: "1px solid #ccc", borderRadius: 16, padding: "10px 18px", fontSize: "1rem", outline: "none", background: "#fafbff" }}
          />
          <button
            onClick={handleSend}
            style={{ background: "#1a237e", color: "#fff", border: "none", borderRadius: 16, padding: "10px 20px", fontSize: "1rem", cursor: "pointer" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotAI;
