import { useState } from "react";
import "./AIChat.css";

type Message = {
  text: string;
  sender: string;
};

export function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! Ask me anything about your internship search.",
      sender: "ai",
    },
    {
      text: "Hi! Can you give suggestions (using less than five words)",
      sender: "user",
    },
    {
      text: "Hi! Of course.",
      sender: "ai",
    },
  ]);

  function sendMessage() {
    if (input.trim() === "") return;

    setMessages([
      ...messages,
      {
        text: input,
        sender: "user",
      },
    ]);

    setInput("");
  }

  return (
    <div className="ai-chat">
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <div className="ai-icon">
            &#10022;
          </div>

          <div>
            <h3>AI Assistant</h3>
            <p>Application insights</p>
          </div>
        </div>

        <div className="ai-online">
          <span></span>
          Online
        </div>
      </div>

      <div className="ai-chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.sender === "ai"
                ? "message-row ai-row"
                : "message-row user-row"
            }
          >
            {message.sender === "ai" && (
              <div className="message-avatar">
                &#10022;
              </div>
            )}

            <div
              className={
                message.sender === "ai"
                  ? "message ai-message"
                  : "message user-message"
              }
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="ai-suggestions">
        <button onClick={() => setInput("How am I doing?")}>
          How am I doing?
        </button>

        <button onClick={() => setInput("What should I focus on?")}>
          What should I focus on?
        </button>
      </div>

      <div className="ai-chat-input">
        <input
          type="text"
          placeholder="Ask about your applications..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>
          &rarr;
        </button>
      </div>
    </div>
  );
}