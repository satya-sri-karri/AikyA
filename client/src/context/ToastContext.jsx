import { createContext, useCallback, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info") => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const toast = useCallback(
    (message, type) => {
      push(message, type);
    },
    [push]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: 96,
          right: 22,
          zIndex: 130,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 16px",
                borderRadius: 14,
                background: "var(--glass-strong)",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--shadow-md)",
                backdropFilter: "blur(16px)",
                fontSize: 13.5,
                fontWeight: 500,
                maxWidth: 320,
                color: "var(--text)",
              }}
            >
              {t.type === "success" && <CheckCircle2 size={17} style={{ color: "var(--success)" }} />}
              {t.type === "warning" && <AlertTriangle size={17} style={{ color: "var(--warning)" }} />}
              {t.type === "error" && <AlertTriangle size={17} style={{ color: "var(--danger)" }} />}
              {t.type === "info" && <Info size={17} style={{ color: "var(--accent)" }} />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}