import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, User, MapPin, Calendar, Bus, Utensils, Building2 } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="search-box" ref={rootRef}>
      <span className="search-icon">
        <SearchIcon size={18} />
      </span>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={compact ? "Search campus..." : "Search anything — people, places, food, events…"}
        style={size === "lg" ? { padding: "16px 18px 16px 48px", fontSize: 15.5 } : undefined}
      />
      <span className="search-kbd">⌘K</span>

      <AnimatePresence>
        {open && query.trim() && (
          <motion.div
            className="search-results"
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {groups.length === 0 && <div className="search-empty">No results for “{query}”. Try a name, block or event.</div>}
            {groups.map((g) => (
              <div key={g.title}>
                <div className="search-group-label">{g.title}</div>
                {g.items.map((r) => (
                  <Link key={`${r.kind}-${r._id || r.label}-${r.to}`} to={r.to} className="search-result" onClick={() => setOpen(false)}>
                    <span className="search-result-icon">{iconFor(r)}</span>
                    <span className="search-result-meta">
                      <strong>{r.label}</strong>
                      <span>{r.sub}</span>
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}