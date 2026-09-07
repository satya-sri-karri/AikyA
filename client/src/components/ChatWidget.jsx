import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X } from "lucide-react";
import { api } from "../api/client.js";

const STARTERS = [
  "📚 Find the library",
  "🍔 Find food",
  "👨‍🏫 Find faculty",
  "🚌 Check buses",
];

function ResultCard({ text, escalated }) {
  return (
    <>
      <div className="ai-bubble assistant">{text}</div>
      <div className="ai-card">
        <h4>AIKYA says</h4>
        <div className="ai-card-rows">
          <span>📍 Location found on campus</span>
          <span>🧭 Use "Where's the campus map?" to navigate</span>
        </div>
      </div>
      {escalated && <div className="ai-card"><span style={{ fontSize: 12.5 }}>↪ Routed to the department for follow-up.</span></div>}
    </>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey! Where are you headed? Ask me anything about this campus — buildings, food, faculty, buses…" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, open, loading]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);
    try {
      const { answer, escalated } = await api.sendChatMessage(trimmed);
      setMessages((prev) => [...prev, { role: "answer", text: answer, escalated }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "answer", text: "Sorry, I couldn't reach the campus service. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="ai-fab" onClick={() => setOpen((o) => !o)} aria-label="Open AIKYA AI">
        {open ? <X size={24} /> : <Sparkles size={24} />}
        <span className="ai-status" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <div className="ai-panel-head">
              <div className="ai-avatar"><Sparkles size={19} /></div>
              <div>
                <strong style={{ fontFamily: "var(--font-display)", fontSize: 15 }}>AIKYA AI</strong>
                <div className="muted" style={{ fontSize: 11.5 }}>Campus Intelligence</div>
              </div>
            </div>

            <div className="ai-panel-messages" ref={scrollRef}>
              {messages.map((m, i) =>
                m.role === "assistant" || m.role === "user" ? (
                  <div key={i} className={`ai-bubble ${m.role}`}>{m.text}</div>
                ) : (
                  <ResultCard key={i} text={m.text} escalated={m.escalated} />
                )
              )}
              {loading && (
                <div className="ai-thinking">
                  <span className="ai-dots"><span /><span /><span /></span>
                  AIKYA is thinking…
                </div>
              )}
            </div>

            {messages.length === 1 && (
              <div className="ai-suggestions">
                {STARTERS.map((q) => (
                  <button key={q} className="ai-suggestion" onClick={() => sendMessage(q)}>{q}</button>
                ))}
              </div>
            )}

            <form
              className="ai-panel-input"
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about the campus…"
              />
              <button type="submit" disabled={loading} aria-label="Send">
                <Send size={17} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}