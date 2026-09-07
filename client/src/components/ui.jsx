import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

/* ---------- GlassCard ---------- */
export function GlassCard({ children, className = "", style }) {
  return (
    <div className={`glass ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ---------- StatusBadge ---------- */
export function StatusBadge({ status }) {
  let cls = "badge";
  let label = status;
  if (typeof status === "string") {
    const s = status.toLowerCase();
    if (s.includes("open") || s === "available" || s === "running" || s === "on route" || s === "free") cls += " badge-open";
    else if (s.includes("closed") || s === "on leave" || s === "offline" || s === "occupied") cls += " badge-closed";
    else if (s.includes("busy") || s === "reserved" || s === "restricted") cls += " badge-busy";
    else cls += " badge-info";
  }
  return (
    <span className={cls}>
      <span className="dot" />
      {label}
    </span>
  );
}

/* ---------- EmptyState ---------- */
export function EmptyState({ icon = "🗒️", title, subtitle }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <strong>{title}</strong>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

/* ---------- Skeleton ---------- */
export function Skeleton({ width = "100%", height = 120, style }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

export function SkeletonGrid({ count = 6, height = 150 }) {
  return (
    <div className="grid grid-auto">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height={height} />
      ))}
    </div>
  );
}

/* ---------- Animated counter ---------- */
export function Counter({ value, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="stat-num">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ---------- PageHeader ---------- */
export function PageHeader({ kicker, title, actions, sub }) {
  return (
    <div className="page-header">
      <div>
        {kicker && <div className="page-kicker">{kicker}</div>}
        <h1>{title}</h1>
        {sub && <p className="muted" style={{ marginTop: 8 }}>{sub}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>{actions}</div>}
    </div>
  );
}

/* ---------- Reveal (scroll fade) ---------- */
export function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Chip ---------- */
export function Chip({ active, onClick, children }) {
  return (
    <button className={`chip ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}