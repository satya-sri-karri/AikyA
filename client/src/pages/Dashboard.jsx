import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation, Users, UtensilsCrossed, BookOpen, Bus, CalendarDays, Star, Clock, Sparkles } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import { useFavorites } from "../lib/useFavorites.js";
import CampusMap from "../components/CampusMap.jsx";
import AIConsole from "../components/AIConsole.jsx";
import { Counter, EmptyState } from "../components/ui.jsx";
import { motion } from "framer-motion";

const QUICK_ACTIONS = [
  { label: "Navigate", sub: "Live maps & routes", icon: Navigation, to: "/map", iconBg: null },
  { label: "Find Faculty", sub: "Availability live", icon: Users, to: "/faculty", iconBg: "#34C48C" },
  { label: "Find Food", sub: "Outlets & menus", icon: UtensilsCrossed, to: "/canteen", iconBg: "#F27BB8" },
  { label: "Library", sub: "Study spaces", icon: BookOpen, to: "/map", iconBg: "#5FB9F2" },
  { label: "Buses", sub: "Routes & stops", icon: Bus, to: "/buses", iconBg: "#E5A00D" },
  { label: "Events", sub: "Today & upcoming", icon: CalendarDays, to: "/events", iconBg: "#8A7BFF" },
];

const CAT_ICON = {
  block: "🏢", library: "📚", shop: "🍴", hostel: "🏠", ground: "🌳", office: "🏛️", service: "🩺",
};

export default function Dashboard() {
  const { data, loading } = useUniverse();
  const navigate = useNavigate();
  const { favorites, recents } = useFavorites();
  const pois = data.pois || [];
  const buses = data.buses || [];
  const faculty = data.faculty || [];
  const events = data.events || [];

  const snapshot = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return [
      { icon: "🚌", num: buses.filter((b) => (b.status || "").toLowerCase().includes("route")).length, label: "Buses on route", sub: `${buses.length} total`, tint: "#E5A00D" },
      { icon: "📅", num: events.filter((e) => (e.date || "").startsWith(today)).length, label: "Events today", sub: `${events.length} upcoming`, tint: "#8A7BFF" },
      { icon: "🍔", num: `${pois.filter((p) => p.type === "shop" && p.isOpenNow).length}/${pois.filter((p) => p.type === "shop").length}`, label: "Food outlets open", sub: "Open right now", tint: "#F27BB8" },
      { icon: "👨‍🏫", num: faculty.filter((f) => !f.onLeave).length, label: "Faculty available", sub: "On campus now", tint: "#34C48C" },
    ];
  }, [buses, events, pois, faculty]);

  const favList = favorites.length > 0 ? favorites : recents;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="dash-layout">
        {/* Left — quick actions */}
        <div className="dash-col dash-col-left">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.45 }}>
            <div className="dash-panel">
              <div className="quick-title">Quick actions</div>
              {QUICK_ACTIONS.map((a) => (
                <Link key={a.label} to={a.to} className="quick-tile">
                  <span className="qa-ic" style={a.iconBg ? { background: a.iconBg + "22", color: a.iconBg } : undefined}>
                    <a.icon size={20} />
                  </span>
                  <span>
                    <span className="qa-lbl">{a.label}</span>
                    <span className="qa-sub">{a.sub}</span>
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Middle — AI hero + live campus */}
        <div className="dash-col dash-col-mid">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.5 }}>
            <AIConsole data={data} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div className="rich-card live-card" style={{ padding: 0 }}>
              <div className="live-head">
                <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="live-pill" style={{ padding: "4px 10px" }}><span className="pulse-dot" /></span>
                  Campus, live
                </h3>
                <Link to="/map" className="btn btn-soft" style={{ padding: "8px 14px", fontSize: 12.5 }}>
                  Open Explore →
                </Link>
              </div>
              <CampusMap mode="dashboard" onNavigate={() => navigate("/map")} />
            </div>
          </motion.div>
        </div>

        {/* Right — snapshots */}
        <div className="dash-col dash-col-right">
          {snapshot.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 + i * 0.05, duration: 0.45 }}>
              <div className="snapshot-card">
                <span className="snap-ic" style={{ background: s.tint + "22", color: s.tint }}>{s.icon}</span>
                <div>
                  <div className="snap-num">
                    {typeof s.num === "number" ? <Counter value={s.num} /> : s.num}
                  </div>
                  <div className="snap-lbl">{s.label}</div>
                  <div className="snap-sub">{s.sub}</div>
                </div>
              </div>
            </motion.div>
          ))}

          {events.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.45 }}>
              <div className="dash-panel" style={{ gap: 10 }}>
                <div className="quick-title">Next up</div>
                {events.slice(0, 2).map((e) => (
                  <Link key={e._id} to="/events" className="quick-tile">
                    <span className="qa-ic">📅</span>
                    <span>
                      <span className="qa-lbl">{e.title}</span>
                      <span className="qa-sub">{e.date} · {e.startTime} · {e.venue}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Recent activity / favorites */}
      {favList.length > 0 && (
        <>
          <div className="dash-section-title">
            {favorites.length > 0 ? <><Star size={16} style={{ color: "var(--warning)" }} /> Favorite spots</> : <><Clock size={16} /> Recently viewed</>}
          </div>
          <div className="recent-row">
            {favList.map((p) => (
              <Link key={p._id} to="/map" className="recent-card">
                <span className="recent-ic">{CAT_ICON[p.type] || "📍"}</span>
                <span>
                  <strong>{p.name}</strong>
                  <span>{p.block || "Campus"}{p.floor ? ` · ${p.floor}` : ""}</span>
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Events strip */}
      <div className="dash-section-title"><Sparkles size={16} style={{ color: "var(--accent-strong)" }} /> Upcoming events</div>
      {loading ? (
        <div className="grid grid-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 100 }} />)}
        </div>
      ) : events.length === 0 ? (
        <EmptyState icon="📅" title="Nothing happening yet" subtitle="We'll let you know when something is scheduled." />
      ) : (
        <div className="grid grid-auto">
          {events.slice(0, 6).map((e) => {
            const d = new Date(e.date);
            return (
              <Link key={e._id} to="/events" className="rich-card">
                <div className="rc-head">
                  <span className="rc-avatar">📅</span>
                  <span>
                    <h3>{e.title}</h3>
                    <span className="rc-sub">{e.organizer}</span>
                  </span>
                </div>
                <div className="rc-rows">
                  <div className="rc-row"><CalendarDays size={15} /> {e.date} · {e.startTime}–{e.endTime}</div>
                  <div className="rc-row">📍 {e.venue}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}