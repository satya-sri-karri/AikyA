import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Send, Mic, Paperclip, ArrowRight } from "lucide-react";
import { api } from "../api/client.js";
import { buildResult, default as ResultCard } from "./resultCards.jsx";
import AIOrb from "./AIOrb.jsx";
import { useToast } from "../context/ToastContext.jsx";

const SUGGESTIONS = [
  { label: "Find my classroom", q: "Where is the academic block?" },
  { label: "Where is the library?", q: "Where is the library?" },
  { label: "Check today's events", q: "What events are happening today?" },
  { label: "Find available faculty", q: "Is any faculty available now?" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function AIConsole({ data }) {
  const navigate = useNavigate();
  const { toast } = useToast() || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  async function send(text) {
    const trimmed = (text ?? input ?? "").trim();
    if (!trimmed || loading) return;
    const card = buildResult(trimmed, data);
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);
    try {
      const { answer } = await api.sendChatMessage(trimmed);
      setMessages((prev) => [...prev, { role: "ai", text: answer, card }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I couldn't reach the campus service. Please try again.", card: null },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const goToMap = (poi) => navigate("/map");
  const goToInfo = (poi) => navigate(poi?.type === "shop" ? "/canteen" : "/map");

  const showWelcome = messages.length === 0;

  return (
    <div className="ai-hero">
      <div className="ai-hero-head">
        <span className="ai-avatar" style={{ width: 40, height: 40 }}><Sparkles size={18} /></span>
        <div>
          <div className="ai-hero-title">AIKYA AI</div>
          <div className="muted" style={{ fontSize: 11.5 }}>Campus intelligence, grounded in live data</div>
        </div>
        <span className="live-pill" style={{ marginLeft: "auto" }}>
          <span className="pulse-dot" /> Connected
        </span>
      </div>

      <div className="ai-hero-body">
        <AIOrb />

        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <div className="ai-greet">{greeting()} 👋</div>
              <p className="ai-sub">How can I help you on campus today?</p>
              <div className="pill-row">
                {SUGGESTIONS.map((s) => (
                  <button key={s.label} className="pill-chip" onClick={() => send(s.q)}>
                    <Sparkles size={13} style={{ color: "var(--accent-strong)" }} /> {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="convo" className="convo" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  {m.role === "user" ? (
                    <div className="msg msg-user">{m.text}</div>
                  ) : (
                    <>
                      <div className="msg msg-ai">{m.text}</div>
                      {m.card && (
                        <ResultCard
                          kind={m.card.kind}
                          item={m.card.item}
                          onNavigate={(item, info) => (info ? goToInfo(item) : goToMap(item))}
                        />
                      )}
                    </>
                  )}
                </motion.div>
              ))}
              {loading && (
                <div className="ai-thinking">
                  <span className="ai-dots"><span /><span /><span /></span>
                  AIKYA is answering…
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="console">
        <form
          className="console-field"
          onSubmit={(e) => { e.preventDefault(); send(); }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your campus…"
            aria-label="Ask AIKYA AI"
          />
          <button type="button" className="console-btn" title="Voice input (coming soon)" onClick={() => toast?.("Voice input is coming soon.", "info")}>
            <Mic size={16} />
          </button>
          <button type="button" className="console-btn" title="Attach (coming soon)" onClick={() => toast?.("Attachments are coming soon.", "info")}>
            <Paperclip size={16} />
          </button>
          <button type="submit" className="console-send" disabled={loading || !input.trim()} aria-label="Send message">
            {loading ? <Sparkles size={18} /> : <Send size={17} style={{ marginLeft: 1 }} />}
          </button>
        </form>
        <div className="console-meta">
          <span>Data source: Live campus</span>
          <span>·</span>
          <span><ArrowRight size={11} /> Enter to send</span>
        </div>
      </div>
    </div>
  );
}