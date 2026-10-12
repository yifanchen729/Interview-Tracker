import { useState, useRef, useEffect } from "react";
import axios from "axios";
import type { Application } from "../data/ApplicationArray";
import "./AIChat.css";

type AIChatProps = {
  applications: Application[];
};

type Message = {
  text: string;
  sender: string;
};

export function AIChat({ applications }: AIChatProps) {
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
      text: "Hi! [Stub].",
      sender: "ai",
    },
  ]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    setMessages((messages) => [
      ...messages,
      {
        text: input,
        sender: "user",
      },
      {
        text: "Loading...",
        sender: "ai",
      },
    ]);

    const message = `
      This is my current applications:
      ${JSON.stringify(applications, null, 2)}

      User question:
      ${input}
      `;
    setInput("");

    const response = await axios.post("http://localhost:5000/api/airesponse", {
      message: message,
    });

    setMessages((messages) =>
      messages.map((message, index) =>
        index === messages.length - 1
          ? {
            text: response.data.response,
            sender: "ai",
          }
          : message,
      ),
    );
  };

  return (
    <div className="ai-chat">
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <div className="ai-icon">&#10022;</div>

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

      <div className="ai-chat-messages" ref={chatRef}>
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
              <div className="message-avatar">&#10022;</div>
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

        <button onClick={sendMessage}>&rarr;</button>
      </div>
    </div>
  );
}
