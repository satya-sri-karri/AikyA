import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Menu, Sun, Moon, ChevronLeft, Bell, CalendarDays, Lock, X, Palmtree, ShieldCheck, Map as MapIcon } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import GlobalSearch from "./GlobalSearch.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { NAV_SECTIONS } from "./Sidebar.jsx";

const LABEL_MAP = Object.fromEntries(
  NAV_SECTIONS.flatMap((s) => s.items).map((i) => [i.to, i.label])
);

function NotificationsBell() {
  const { data } = useUniverse();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const items = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const notes = [];
    const eventsToday = (data.events || []).filter((e) => (e.date || "").startsWith(today));
    eventsToday.forEach((e) =>
      notes.push({
        id: "evt-" + e._id,
        icon: <CalendarDays size={15} />,
        title: `Event today: ${e.title}`,
        body: `${e.startTime} · ${e.venue}`,
        to: "/events",
      })
    );
    (data.pois || [])
      .filter((p) => p.accessPolicy && p.accessPolicy.note)
      .forEach((p) =>
        notes.push({
          id: "pol-" + p._id,
          icon: <Lock size={15} />,
          title: `${p.name} access note`,
          body: p.accessPolicy.note,
          to: "/map",
        })
      );
    if (notes.length === 0) {
      notes.push({
        id: "empty",
        icon: <Bell size={15} />,
        title: "You're all caught up",
        body: "Nothing scheduled for today.",
        to: null,
      });
    }
    return notes.slice(0, 7);
  }, [data]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  return (
    <div className="notif" ref={ref}>
      <button className="icon-btn" onClick={() => setOpen((o) => !o)} title="Notifications">
        <Bell size={17} />
        {items.some((i) => i.id !== "empty") && <span className="notif-dot" />}
      </button>
      {open && (
        <div className="notif-panel">
          <div className="notif-head">
            <strong>Notifications</strong>
            <button className="icon-btn" onClick={() => setOpen(false)}><X size={14} /></button>
          </div>
          <div className="notif-list">
            {items.map((n) =>
              n.to ? (
                <Link key={n.id} to={n.to} className="notif-item" onClick={() => setOpen(false)}>
                  <span className="notif-ic" style={n.id.startsWith("pol-") ? { background: "var(--warning-soft)", color: "var(--warning)" } : undefined}>{n.icon}</span>
                  <span>
                    <strong style={{ fontSize: 13, display: "block" }}>{n.title}</strong>
                    <span className="muted" style={{ fontSize: 12 }}>{n.body}</span>
                  </span>
                </Link>
              ) : (
                <div key={n.id} className="notif-item">
                  <span className="notif-ic">{n.icon}</span>
                  <span>
                    <strong style={{ fontSize: 13, display: "block" }}>{n.title}</strong>
                    <span className="muted" style={{ fontSize: 12 }}>{n.body}</span>
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileChip() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  return (
    <div className="position-relative" style={{ position: "relative" }} ref={ref}>
      <button className="profile-chip" onClick={() => setOpen((o) => !o)} title="Profile" aria-label="Profile">
        ◈
      </button>
      {open && (
        <div className="profile-pop">
          <div style={{ padding: "10px 12px" }}>
            <strong style={{ fontSize: 13.5, display: "block" }}>Campus guest</strong>
            <span className="muted" style={{ fontSize: 11.5 }}>Signed in on this device</span>
          </div>
          <button onClick={toggle}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <Link to="/admin"><ShieldCheck size={15} /> Admin console</Link>
          <Link to="/map"><MapIcon size={15} /> Explore map</Link>
          <Link to="/home"><Palmtree size={15} /> Landing page</Link>
        </div>
      )}
    </div>
  );
}

export default function Navbar({ onMenuClick }) {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const parts = pathname.split("/").filter(Boolean);
  let crumbPath = "";
  for (const p of parts) {
    const candidate = "/" + parts.slice(0, parts.indexOf(p) + 1).join("/");
    if (LABEL_MAP[candidate]) crumbPath = candidate;
  }
  const rootMatch = "/" + (parts[0] || "");
  const label = LABEL_MAP[crumbPath] ?? LABEL_MAP[rootMatch] ?? "Home";

  return (
    <header className="topbar">
      <button className="topbar-mobile-menu" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <Link to="/" className="brand" title="AIKYA — one campus, connected">
        <span className="brand-mark">✦</span>
        <span>
          <span className="brand-name">AIKYA</span>
          <span className="brand-tag">One campus · connected</span>
        </span>
      </Link>

      <div className="breadcrumbs">
        <button
          className="btn-ghost"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "none", cursor: "pointer", color: "inherit", padding: 0 }}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="breadcrumb-current">{label}</span>
      </div>

      <div className="topbar-search">
        <GlobalSearch />
      </div>

      <div className="topbar-right">
        <NotificationsBell />
        <button className="icon-btn" onClick={toggle} title="Toggle theme">
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <ProfileChip />
        <button className="btn btn-primary" onClick={() => navigate(pathname === "/map" ? "/" : "/map")}>
          {pathname === "/map" ? "Home" : "Explore Map"}
        </button>
      </div>
    </header>
  );
}