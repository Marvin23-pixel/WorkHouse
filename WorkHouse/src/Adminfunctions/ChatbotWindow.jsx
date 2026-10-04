import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  CheckCheck,
  ChevronRight,
  CircleHelp,
  Clock3,
  MessageCircle,
  Paperclip,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import "../Styles/chatbotwindow.css";

const suggestions = [
  "How do I manage staff?",
  "How do I record a sale?",
  "How does Advanced Payment work?",
  "I need help",
];

const initialMessages = [
  {
    id: "welcome",
    sender: "bot",
    text: "Hi there! I’m your WorkHouse Assistant. How can I help you today?",
    time: "Now",
  },
];

function getBotResponse(message) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("staff") || normalizedMessage.includes("team")  || normalizedMessage.includes("members")) {
    return "You can manage staff from the Admin Dashboard. Add team members, assign roles, and update access permissions. N/B:Ensure you are logged in as an admin to access the admin dashboard";
  }

  if (normalizedMessage.includes("sale") || normalizedMessage.includes("record")) {
    return "To record a sale, tap Record New Sale from your dashboard, scan or select the products, then complete the payment step to save the transaction.";
  }

  if (normalizedMessage.includes("advanced") || normalizedMessage.includes("payment")) {
    return "Advanced Payment lets you choose and track different payment methods for a transaction. You can review the payment status from your sales records.";
  }

  if (normalizedMessage.includes("stock") || normalizedMessage.includes("inventory")) {
    return "You can check current stock from Stock Inventory. Products that need attention will appear in the reorder alerts on your dashboard.";
  }

  return "I’m here to help with sales, staff, payments, and inventory and WorkHouse functions. Try one of the suggested questions, or tell me what you need help with.";
}

function ChatbotWindow({ isOpen = true, onClose }) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const responseTimerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (responseTimerRef.current) {
        window.clearTimeout(responseTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  const sendMessage = (message) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isTyping) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmedMessage,
      time: "Now",
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    responseTimerRef.current = window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: getBotResponse(trimmedMessage),
          time: "Now",
        },
      ]);
      setIsTyping(false);
    }, 850);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <aside className="chatbot-window" aria-label="DIGISOL Assistant">
      <div className="chatbot-header">
        <div className="chatbot-header-glow" />
        <div className="chatbot-identity">
          <div className="chatbot-avatar" aria-hidden="true">
            <Bot size={21} strokeWidth={2.1} />
            <span className="avatar-sparkle"><Sparkles size={9} /></span>
          </div>
          <div className="chatbot-title-group">
            <div className="chatbot-title-row">
              <h2>WorkHouse Assistant</h2>
              <span className="ai-badge">AI</span>
            </div>
            {/* <div className="chatbot-status"><span className="status-dot" />Online and ready</div> */}
          </div>
        </div>
        <button className="chatbot-close" type="button" onClick={onClose} aria-label="Close chatbot">
          <X size={18} />
        </button>
      </div>

      <div className="chatbot-body">
        <div className="chatbot-intro-card">
          <div className="intro-icon"><MessageCircle size={17} /></div>
          <div>
            {/* <span className="intro-eyebrow">Your digital co-pilot</span> */}
            <p>Ask me anything about your WorkHouse workspace.</p>
          </div>
        </div>

        <div className="chatbot-messages" role="log" aria-live="polite">
          {messages.map((message) => (
            <div className={`chat-message-row ${message.sender}`} key={message.id}>
              {message.sender === "bot" && (
                <div className="message-avatar" aria-hidden="true"><Bot size={14} /></div>
              )}
              <div className="chat-message-content">
                <div className="chat-message-bubble">{message.text}</div>
                <div className="message-meta">
                  <Clock3 size={10} />
                  <span>{message.time}</span>
                  {message.sender === "user" && <CheckCheck size={12} className="message-read" />}
                </div>
              </div>
            </div>
          ))}

          {messages.length === 1 && !isTyping && (
            <div className="suggestion-section">
              <div className="suggestion-heading"><span>Try asking</span><ChevronRight size={14} /></div>
              <div className="suggestion-list">
                {suggestions.map((suggestion) => (
                  <button className="suggestion-chip" type="button" key={suggestion} onClick={() => sendMessage(suggestion)}>
                    <span>{suggestion}</span>
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {isTyping && (
            <div className="chat-message-row bot typing-row">
              <div className="message-avatar" aria-hidden="true"><Bot size={14} /></div>
              <div className="chat-message-content">
                <div className="typing-bubble" aria-label="Assistant is typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form className="chatbot-composer" onSubmit={handleSubmit}>
        <div className="composer-shell">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Ask WorkHouse Assistant..."
            aria-label="Message WorkHouse Assistant"
            disabled={isTyping}
          />
          <button className="composer-attachment" type="button" aria-label="Attach a file" disabled>
            <Paperclip size={17} />
          </button>
          <button className="composer-send" type="submit" aria-label="Send message" disabled={!inputValue.trim() || isTyping}>
            <Send size={16} />
          </button>
        </div>
        <div className="composer-hint"><CircleHelp size={11} /><span>WorkHouse Assistant can make mistakes</span></div>
      </form>
    </aside>
  );
}

export default ChatbotWindow;
