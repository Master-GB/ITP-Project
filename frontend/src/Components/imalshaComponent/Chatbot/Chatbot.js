import { useEffect, useState } from "react";

const ChatBox = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const scriptLoader = () => {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "w1xe436d-EOtIaO9_cgaU";
      script.domain = "www.chatbase.co";
      document.body.appendChild(script);
    };

    const initChatbase = () => {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args) => {
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(args);
        };

        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") return target.q;
            return (...args) => target(prop, ...args);
          }
        });
      }

      if (document.readyState === "complete") {
        scriptLoader();
      } else {
        window.addEventListener("load", scriptLoader);
      }
    };

    initChatbase();

    return () => {
      const existingScript = document.getElementById("w1xe436d-EOtIaO9_cgaU");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1000,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#1976D2",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 16px rgba(25,118,210,0.2)",
          fontSize: 32,
          cursor: "pointer"
        }}
        aria-label={open ? "Close Chatbot" : "Open Chatbot"}
      >
        {open ? "×" : "💬"}
      </button>
      {/* The Chatbase widget will appear when open, script is injected above */}
    </>
  );
};

export default ChatBox;
