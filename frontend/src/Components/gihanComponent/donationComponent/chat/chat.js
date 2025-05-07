import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import "./chat.css";

const SOCKET_SERVER_URL = "http://localhost:5000";

const EMOJIS = ["😀","😂","😍","😎","😭","👍","🙏","🎉","❤️","🔥","😅","🙌","🥳","😇","💯"];

function getOrCreateUserId() {
  let userId = localStorage.getItem('chatUserId');
  if (!userId) {
    userId = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('chatUserId', userId);
  }
  return userId;
}

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [userId] = useState(getOrCreateUserId());
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.on("chat message", (msgObj) => {
      setMessages((prev) => [...prev, msgObj]);
    });
    socketRef.current.on("chat history", (msgs) => {
      setMessages(msgs);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  
  const handleSend = () => {
    if (input.trim()) {
      const msgObj = { text: input, userId };
      socketRef.current.emit("chat message", msgObj);
      setInput("");
    }
  };

  const handleClear = () => {
    socketRef.current.emit("clear chat");
    setMessages([]);
  };

  const handleEmoji = (emoji) => {
    setInput(input + emoji);
    setShowEmojis(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };


  return (
    <div className="chatBac">
    <div className="chat-container">
      <div className="chat-header">Messaging App</div>
      <div className="chat-messages">
        {messages.map((msg, idx) => {
          const isSent = msg.userId && userId && msg.userId === userId;
          return (
            <div key={idx} className={`chat-message ${isSent ? 'sent' : 'received'}`}>
              {msg.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-section">
        <button
          className="emoji-btn"
          onClick={() => setShowEmojis(!showEmojis)}
          title="Pick emoji"
        >
          😊
        </button>
        {showEmojis && (
          <div className="emoji-picker">
            {EMOJIS.map((emoji, idx) => (
              <span
                key={idx}
                className="emoji-item"
                onClick={() => handleEmoji(emoji)}
                style={{ fontSize: 22, cursor: 'pointer', margin: 2 }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button onClick={handleSend} className="chat-send-btn">
          Send
        </button>
        <button className="chat-clear-btn" onClick={handleClear} title="Clear chat history" style={{marginLeft: 8}}>
          🗑️
        </button>
      </div>
    </div>
    </div>
  );
};

export default Chat;