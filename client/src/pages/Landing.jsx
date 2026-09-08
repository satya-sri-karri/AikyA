import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass, Map, Bot, DoorOpen, BellRing, IceCreamBowl, Sparkles, ArrowRight,
  GraduationCap, Bus, ShieldCheck, CalendarDays, ChevronRight, Siren,
} from "lucide-react";
import CampusMap from "../components/CampusMap.jsx";
import AIConsole from "../components/AIConsole.jsx";
import { useUniverse } from "../lib/useUniverse.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { Reveal, Counter, EmptyState } from "../components/ui.jsx";
import { Sun, Moon } from "lucide-react";

const LOCAL_LINKS = [
  { to: "/", label: "Home" },
  { to: "/map", label: "Explore" },
  { to: "/faculty", label: "People" },
  { to: "/canteen", label: "Food" },
  { to: "/buses", label: "Transit" },
  { to: "/events", label: "Events" },
];

const FEATURES = [
  {
    icon: <Map size={24} />,
    title: "Explore",
    text: "The campus itself is the interface. Zoom from campus to building to floor to room — everything connected to a real place.",
  },
  {
    icon: <Compass size={24} />,
    title: "Navigate",
    text: "Walking guidance with distance and ETA — across roads, gates, floors, elevators and accessible routes.",
  },
  {
    icon: <Bot size={24} />,
    title: "Ask",
    text: "AIKYA AI understands your campus. Ask where things are, who teaches what, when the next bus leaves — grounded answers, never invented.",
  },
  {
    icon: <DoorOpen size={24} />,
    title: "Connect",
    text: "Faculty profiles with live availability. Departments, labs, hostels and services — all discoverable in seconds.",
  },
  {
    icon: <BellRing size={24} />,
    title: "Live",
    text: "Events, running routes, open food outlets and campus alerts — a snapshot of what is happening right now.",
  },
  {
    icon: <IceCreamBowl size={24} />,
    title: "Spatial",
    text: "Gender, role and time-based access policies rendered honestly — so everyone knows where they can and cannot go.",
  },
];

const PROMPTS = [
  { icon: "🧭", q: "Where is my classroom?" },
  { icon: "🍔", q: "Is the food court open?" },
  { icon: "🚌", q: "When does the next bus leave?" },
  { icon: "👨‍🏫", q: "Which faculty are free right now?" },
];

const PERSONAS = [
  {
    icon: <GraduationCap size={22} />,
    title: "Students",
    points: ["Find classrooms, labs & cabins instantly", "Check what's open now and what's coming up", "Never miss a bus, event or free meal"],
  },
  {
    icon: "👨‍🏫",
    title: "Faculty",
    points: ["Share availability and headline hours", "Publish lab blocks and office timings", "Reach the departments that matter"],
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Administration",
    points: ["One source of truth for facilities", "Manage access policies honestly", "Understand how campus is actually used"],
  },
  {
    icon: "🎓",
    title: "Visitors",
    points: ["Explore before you arrive", "Navigate from the main gate", "Reach the right office the first time"],
  },
];

const SAFETY_POINTS = [
  "A single Emergency Mode for medical, security, fire and contacts",
  "Nearest medical facility surfaced in one tap",
  "Warden, driver and service contacts where you need them",
];

export default function Landing() {
  const { theme, toggle } = useTheme();
  const { data } = useUniverse();

  const pois = data.pois || [];
  const buses = data.buses || [];
  const faculty = data.faculty || [];
  const events = data.events || [];
  const departments = data.departments || [];

  const routesOnRoute = buses.filter((b) => (b.status || "").toLowerCase().includes("route")).length;
  const today = new Date().toISOString().slice(0, 10);
  const todaysEvents = events.filter((e) => (e.date || "").startsWith(today));
  const medical = pois.find((p) => (p.name || "").toLowerCase().includes("medical")) || pois.find((p) => p.type === "service");

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="landing">
      <header className="landing-topbar">
        <Link to="/" className="sidebar-logo" style={{ padding: 0 }}>
          <span className="sidebar-logo-mark">✦</span>
          <span className="sidebar-logo-text">AIKYA</span>
        </Link>

        <nav className="landing-links">
          {LOCAL_LINKS.map((l) => (
            <Link key={l.to} to={l.to}>{l.label}</Link>
          ))}
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <button className="icon-btn" onClick={toggle} title="Toggle theme" aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link to="/" className="btn btn-primary">Open App</Link>
        </div>
      </header>

      <main>
        {/* ---------- HERO ---------- */}
        <section className="landing-hero">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <span className="eyebrow"><Sparkles size={14} /> AI-Powered Campus Intelligence</span>
            <h1>
              Your Campus.
              <br />
              <span className="accent-text">One Intelligence.</span>
            </h1>
            <p className="hero-sub">
              Every school, block, lab, bus route and event mapped into one living digital twin —
              with an AI that actually understands it.
            </p>

            <div className="hero-stats">
              <div className="hero-stat"><strong><Counter value={departments.length || 14} suffix="+" /></strong><span>Schools & Departments</span></div>
              <div className="hero-stat"><strong><Counter value={pois.length || 22} suffix="+" /></strong><span>Campus Facilities</span></div>
              <div className="hero-stat"><strong><Counter value={buses.length} /></strong><span>Buses · {routesOnRoute} live</span></div>
              <div className="hero-stat"><strong><Counter value={faculty.length} /></strong><span>Faculty Members</span></div>
            </div>

            <div className="hero-cta">
              <button className="btn btn-primary btn-lg" onClick={() => scrollTo("aikya")}>
                Ask AIKYA <ArrowRight size={17} style={{ marginLeft: 2 }} />
              </button>
              <Link to="/" className="btn btn-lg">Explore Campus</Link>
            </div>
          </motion.div>

          <div className="landing-viz">
            <span className="map-float-label" style={{ left: "12%", top: "8%" }}>🏫 CSE · IT BLOCK</span>
            <span className="map-float-label" style={{ right: "14%", top: "14%", animationDelay: "1s" }}>📚 KNOWLEDGE RESOURCE CENTRE</span>
            <span className="map-float-label" style={{ left: "20%", bottom: "16%", animationDelay: "0.6s" }}>🍔 MAIN FOOD COURT</span>
            <span className="map-float-label" style={{ right: "8%", bottom: "26%", animationDelay: "1.4s" }}>🚌 TRANSPORT HUB</span>
            <span className="map-float-label" style={{ left: "6%", top: "46%", animationDelay: "2s" }}>🏠 BOYS · GIRLS HOSTEL</span>
            <CampusMap mode="dashboard" height={430} onNavigate={() => {}} />
          </div>
        </section>

        {/* ---------- MEET THE INTELLIGENCE ---------- */}
        <section className="landing-section" id="aikya">
          <Reveal>
            <h2>Meet the intelligence <span className="accent-text">behind your campus.</span></h2>
            <p className="section-sub">
              Ask anything in plain language. AIKYA answers from live campus data — with quick-result
              cards for places, people, buses and events. Grounded. Never invented.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="ai-section-wrap">
              <AIConsole data={data} />
              <div className="ai-ds-note">
                <span className="live-pill"><span className="pulse-dot" /> Connected to live campus data</span>
                <Link to="/map" className="btn btn-soft">Open the digital twin <ChevronRight size={14} /></Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ---------- EVERYTHING CONNECTED ---------- */}
        <section className="landing-section">
          <Reveal>
            <h2>Everything around you. <span className="accent-text">Connected.</span></h2>
            <p className="section-sub">
              From the School of Engineering to School of Pharmacy — blocks, labs, people, food,
              transit, hostels, events and services, all mapped and connected to the campus
              intelligence layer.
            </p>
          </Reveal>
          <div className="landing-features">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="landing-feature">
                  <div className="lf-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- EXPLORE THE CAMPUS ITSELF ---------- */}
        <section className="landing-section">
          <Reveal>
            <h2>Explore the campus <span className="accent-text">itself.</span></h2>
            <p className="section-sub">
              The map isn't a diagram — it's the real campus. Buildings, rooms, floors, access
              policies and live statuses rendered in place.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="map-focus-shell">
              <CampusMap mode="dashboard" height={480} onNavigate={() => {}} />
              <div className="map-focus-foot">
                <span className="live-pill"><span className="pulse-dot" /> Live · every marker is a real place</span>
                <Link to="/map" className="btn btn-primary">Open full map <ArrowRight size={15} style={{ marginLeft: 2 }} /></Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ---------- REAL CAMPUS QUESTIONS ---------- */}
        <section className="landing-section">
          <Reveal>
            <h2>Built around <span className="accent-text">real campus questions.</span></h2>
            <p className="section-sub">
              Not a demo deck of features — the questions students and staff actually ask every day.
            </p>
          </Reveal>
          <div className="prompt-grid">
            {PROMPTS.map((p, i) => (
              <Reveal key={p.q} delay={i * 0.05}>
                <button className="prompt-chip" onClick={() => scrollTo("aikya")}>
                  <span className="prompt-ic">{p.icon}</span>
                  {p.q}
                  <ArrowRight size={15} style={{ marginLeft: "auto", opacity: 0.6 }} />
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- WHAT'S HAPPENING ---------- */}
        <section className="landing-section">
          <Reveal>
            <h2>What's happening <span className="accent-text">around campus?</span></h2>
            <p className="section-sub">Live events, today and up next — curated from the campus calendar.</p>
          </Reveal>
          {events.length === 0 ? (
            <EmptyState icon="📅" title="Nothing happening yet" subtitle="We'll let you know when something is scheduled." />
          ) : (
            <div className="landing-events">
              {events.slice(0, 3).map((e, i) => (
                <Reveal key={e._id} delay={i * 0.05}>
                  <Link to="/events" className="landing-event">
                    <span className="landing-event-ic"><CalendarDays size={18} /></span>
                    <span className="landing-event-body">
                      <strong>{e.title}</strong>
                      <span className="landing-event-meta">
                        {e.date} · {e.startTime}–{e.endTime} · {e.venue}
                      </span>
                    </span>
                    <ChevronRight size={16} className="landing-event-arrow" />
                  </Link>
                </Reveal>
              ))}
              {todaysEvents.length > 0 && (
                <div className="today-pill"><span className="pulse-dot" /> {todaysEvents.length} event{todaysEvents.length > 1 ? "s" : ""} today</div>
              )}
            </div>
          )}
        </section>

        {/* ---------- SAFETY ---------- */}
        <section className="landing-section">
          <Reveal>
            <div className="safety-card">
              <div>
                <span className="safety-eyebrow"><Siren size={14} /> When every second matters.</span>
                <h2 style={{ textAlign: "left", marginTop: 14 }}>Emergency mode, <span style={{ color: "var(--danger)" }}>one tap away.</span></h2>
                <ul className="safety-points">
                  {SAFETY_POINTS.map((s) => (
                    <li key={s}><ShieldCheck size={16} style={{ color: "var(--success)", flexShrink: 0 }} /> {s}</li>
                  ))}
                </ul>
              </div>
              <div className="safety-med" style={{ textAlign: "left" }}>
                {medical && (
                  <>
                    <span className="micro">Nearest medical facility</span>
                    <strong style={{ display: "block", fontSize: 17, margin: "6px 0 2px" }}>{medical.name}</strong>
                    <p className="muted" style={{ fontSize: 12.5 }}>{medical.openHours || medical.description}</p>
                  </>
                )}
                <Link to="/" className="btn btn-danger">Open Emergency Mode</Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ---------- PERSONAS ---------- */}
        <section className="landing-section">
          <Reveal>
            <h2>One campus. <span className="accent-text">Different journeys.</span></h2>
            <p className="section-sub">AIKYA adapts to who you are — and what you're trying to do on campus.</p>
          </Reveal>
          <div className="persona-grid">
            {PERSONAS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="persona-card">
                  <div className="pc-icon">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <ul>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- FINAL CTA ---------- */}
        <section className="landing-cta"
          style={{ maxWidth: 1180, margin: "0 auto", paddingBottom: 100 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="final-cta">
              <h2>Stop searching. <br /><span style={{ opacity: 0.92 }}>Start exploring.</span></h2>
              <p style={{ margin: "16px auto 30px", maxWidth: 560, fontSize: 16, opacity: 0.9 }}>
                Your campus is already mapped, connected and understood. Ask anything — it knows.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn btn-lg" style={{ background: "#fff", color: "var(--blue)", border: "none", boxShadow: "var(--shadow-md)" }} onClick={() => scrollTo("aikya")}>
                  <Sparkles size={17} /> Ask AIKYA
                </button>
                <Link to="/" className="btn btn-lg" style={{ background: "rgba(255,255,255,0.16)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)" }}>
                  Explore Campus
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}