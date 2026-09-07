import { useState, useRef, useEffect } from "react";
import { api } from "../api/client.js";

const STARTER_QUESTIONS = [
  "Where is the AI Lab?",
  "Which canteen is open now?",
  "What time is the next bus?",
  "Can I go to Mango Garden now?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm Campus AI. Ask me anything about the campus." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, open]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const { answer, escalated } = await api.sendChatMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: answer, escalated },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't reach the campus AI service. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Ask Campus AI"}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">Campus AI</div>

          <div className="chat-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={"chat-bubble " + m.role}>
                {m.text}
                {m.escalated && (
                  <div className="chat-escalated-tag">Routed to department for follow-up</div>
                )}
              </div>
            ))}
            {loading && <div className="chat-bubble assistant">Thinking...</div>}
          </div>

          {messages.length === 1 && (
            <div className="chat-suggestions">
              {STARTER_QUESTIONS.map((q) => (
                <button key={q} className="chat-suggestion" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            className="chat-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the campus..."
            />
            <button type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
