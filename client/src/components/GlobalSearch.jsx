import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, User, MapPin, Calendar, Bus, Utensils, Building2 } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_SUGGESTIONS = [
  { label: "Find faculty", q: "faculty" },
  { label: "Find food", q: "canteen" },
  { label: "Library", q: "library" },
  { label: "Bus routes", q: "bus" },
  { label: "Events", q: "event" },
];

function iconFor(ref) {
  if (ref.kind === "faculty") return <User size={18} />;
  if (ref.kind === "event") return <Calendar size={18} />;
  if (ref.kind === "bus") return <Bus size={18} />;
  if (ref.kind === "shop") return <Utensils size={18} />;
  if (ref.kind === "department") return <Building2 size={18} />;
  return <MapPin size={18} />;
}

function toRefs(faculty, departments, pois, buses, events) {
  const out = [];
  for (const f of faculty || []) {
    out.push({
      kind: "faculty",
      label: f.name,
      sub: `${f.designation} · ${f.departmentName} · ${f.cabin || ""}`,
      to: "/faculty",
      _id: f._id,
    });
  }
  for (const d of departments || []) {
    out.push({ kind: "department", label: d.name, sub: `${d.block} · ${d.floor} · HOD ${d.hod || ""}`, to: "/departments" });
  }
  for (const p of pois || []) {
    if (p.type === "shop") out.push({ kind: "shop", label: p.name, sub: p.openHours, to: "/canteen" });
    else out.push({ kind: "poi", label: p.name, sub: `${p.block || ""} ${p.openHours ? "· " + p.openHours : ""}`, to: "/map" });
  }
  for (const b of buses || []) {
    out.push({ kind: "bus", label: `Bus Route ${b.routeNumber}`, sub: b.routeDescription || "", to: "/buses" });
  }
  for (const e of events || []) {
    out.push({ kind: "event", label: e.title, sub: `${e.date} · ${e.venue}`, to: "/events" });
  }
  return out;
}

export default function GlobalSearch({ compact = false, size = "md" }) {
  const { data } = useUniverse();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const paletteInputRef = useRef(null);

  const allRefs = useMemo(
    () => toRefs(data.faculty, data.departments, data.pois, data.buses, data.events),
    [data]
  );

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matches = allRefs.filter(
      (r) => r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q)
    );
    const byKind = (kind) => matches.filter((m) => m.kind === kind);
    const out = [];
    const order = [
      ["faculty", "People"],
      ["poi", "Locations"],
      ["shop", "Food"],
      ["department", "Departments"],
      ["bus", "Transport"],
      ["event", "Events"],
    ];
    for (const [kind, title] of order) {
      const items = byKind(kind);
      if (items.length) out.push({ title, items });
    }
    return out;
  }, [query, allRefs]);

  function openPalette() {
    setOpen(true);
    requestAnimationFrame(() => paletteInputRef.current?.focus());
  }

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) setOpen(false);
        else openPalette();
        return;
      }
      if (e.key === "Escape") setOpen(false);
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target?.tagName || "").toLowerCase();
        const typing = tag === "input" || tag === "textarea" || tag === "select" || e.target?.isContentEditable;
        if (!typing) {
          e.preventDefault();
          openPalette();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyFocus = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyFocus);
    return () => window.removeEventListener("keydown", onKeyFocus);
  }, [open]);

  const close = () => { setOpen(false); setQuery(""); };

  return (
    <div className="search-box" ref={rootRef}>
      <span className="search-icon">
        <SearchIcon size={18} />
      </span>
      <input
        value={query}
        readOnly
        onFocus={openPalette}
        placeholder={compact ? "Search campus..." : "Search anything — people, places, food, events…"}
        style={size === "lg" ? { padding: "16px 18px 16px 48px", fontSize: 15.5 } : undefined}
        aria-label="Search campus"
      />
      <span className="search-kbd">/ · ⌘K</span>

      <AnimatePresence>
        {open && (
          <motion.div
            className="palette-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
          >
            <motion.div
              className="palette"
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
            >
              <div className="palette-input-row">
                <SearchIcon size={20} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                <input
                  ref={paletteInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search anything on campus…"
                  aria-label="Search campus palette"
                />
                <span className="palette-kbd-esc">esc</span>
              </div>

              {!query.trim() && allRefs.length > 0 && (
                <div className="palette-suggestion-row">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button key={s.label} className="palette-suggestion" onClick={() => setQuery(s.q)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="palette-body">
                {query.trim() && groups.length === 0 && (
                  <div className="search-empty">No results for “{query}”. Try a name, block or event.</div>
                )}
                {groups.map((g) => (
                  <div key={g.title}>
                    <div className="search-group-label">{g.title}</div>
                    {g.items.map((r) => (
                      <Link key={`${r.kind}-${r._id || r.label}-${r.to}`} to={r.to} className="search-result" onClick={close}>
                        <span className="search-result-icon">{iconFor(r)}</span>
                        <span className="search-result-meta">
                          <strong>{r.label}</strong>
                          <span>{r.sub}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}