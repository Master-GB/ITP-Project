import { useEffect } from "react";

const ChatBox = () => {
  useEffect(() => {
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
  }, []);

  return null; // No visual output, only script injection
};

export default ChatBox;
