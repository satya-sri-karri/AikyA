import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation, Users, UtensilsCrossed, BookOpen, Bus, CalendarDays } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import CampusMap from "../components/CampusMap.jsx";
import GlobalSearch from "../components/GlobalSearch.jsx";
import { Counter, EmptyState } from "../components/ui.jsx";
import { motion } from "framer-motion";

const QUICK_ACTIONS = [
  { label: "Navigate", icon: Navigation, to: "/map", tint: "var(--accent)" },
  { label: "Find Faculty", icon: Users, to: "/faculty" },
  { label: "Find Food", icon: UtensilsCrossed, to: "/canteen" },
  { label: "Library", icon: BookOpen, to: "/map" },
  { label: "Buses", icon: Bus, to: "/buses" },
  { label: "Events", icon: CalendarDays, to: "/events" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { data, loading } = useUniverse();
  const navigate = useNavigate();
  const pois = data.pois || [];
  const buses = data.buses || [];
  const faculty = data.faculty || [];
  const events = data.events || [];

  const snapshot = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      busesActive: buses.filter((b) => (b.status || "").toLowerCase().includes("route")).length,
      eventsToday: events.filter((e) => (e.date || "").startsWith(today)).length,
      foodOpen: pois.filter((p) => p.type === "shop" && p.isOpenNow).length,
      facultyAvailable: faculty.filter((f) => !f.onLeave).length,
      foodTotal: pois.filter((p) => p.type === "shop").length,
    };
  }, [buses, events, pois, faculty]);

  const STATS = [
    { icon: "🚌", label: "buses on route", value: snapshot.busesActive, tint: "#E5A00D" },
    { icon: "📅", label: "events today", value: snapshot.eventsToday, tint: "var(--accent)" },
    { icon: "🍔", label: "food outlets open", value: `${snapshot.foodOpen}/${snapshot.foodTotal}`, tint: "#EC6B4F" },
    { icon: "👨‍🏫", label: "faculty available", value: snapshot.facultyAvailable, tint: "#1E9E5A" },
  ];

  return (
    <div>
      <header style={{ marginBottom: 22 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <h1 style={{ fontSize: 32, letterSpacing: "-0.03em" }}>
            {greeting()} 👋
          </h1>
          <p className="muted" style={{ marginTop: 6, fontSize: 15 }}>
            What are you looking for on campus today?
          </p>
        </motion.div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: 680, marginBottom: 26 }}
      >
        <GlobalSearch size="lg" />
      </motion.div>

      <div className="quick-actions" style={{ marginBottom: 26 }}>
        {QUICK_ACTIONS.map((a, i) => (
          <motion.div key={a.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.04, duration: 0.4 }}>
            <Link to={a.to} className="quick-action">
              <span className="qa-icon" style={{ background: a.tint + "22", color: a.tint }}>
                <a.icon size={22} />
              </span>
              {a.label}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="stat-grid" style={{ marginBottom: 26 }}>
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.04 }}>
            <div className="stat-card">
              <span className="stat-icon" style={{ background: s.tint + "1c", color: s.tint }}>{s.icon}</span>
              <div>
                {typeof s.value === "number" ? <Counter value={s.value} /> : <span className="stat-num">{s.value}</span>}
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", alignItems: "start" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.5 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontSize: 20 }}>Campus, live</h2>
            <Link to="/map" className="btn btn-soft" style={{ padding: "7px 14px", fontSize: 13 }}>
              Open Explore →
            </Link>
          </div>
          <CampusMap mode="dashboard" onNavigate={(poi) => navigate("/map")} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.5 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>Today's events</h2>
          {loading ? (
            <div className="grid" style={{ gap: 10 }}>
              {[1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 110 }} />)}
            </div>
          ) : events.length === 0 ? (
            <EmptyState icon="📅" title="Nothing happening yet" subtitle="We'll let you know when something is scheduled." />
          ) : (
            <div className="grid" style={{ gap: 10 }}>
              {events.slice(0, 4).map((e) => (
                <Link key={e._id} to="/events" className="card" style={{ padding: 14, display: "flex", gap: 12, alignItems: "center", textDecoration: "none" }}>
                  <span style={{ fontSize: 24 }}>📅</span>
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ fontSize: 14, display: "block" }}>{e.title}</strong>
                    <span className="muted" style={{ fontSize: 12 }}>{e.date} · {e.startTime} · {e.venue}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}