import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, DoorOpen, Map, Bot, BellRing, IceCreamBowl } from "lucide-react";
import CampusMap from "../components/CampusMap.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { Reveal } from "../components/ui.jsx";
import { Sun, Moon } from "lucide-react";

const FEATURES = [
  {
    icon: <Map size={24} />,
    title: "Explore",
    text: "The campus itself is the interface. Zoom from campus to building to floor to room — everything connected to a real place.",
  },
  {
    icon: <Compass size={24} />,
    title: "Navigate",
    text: "Turn-by-turn walking guidance, distance and ETA — across roads, gates, floors, elevators and accessible routes.",
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

export default function Landing() {
  const { theme, toggle } = useTheme();

  return (
    <div className="landing">
      <header className="landing-topbar">
        <Link to="/" className="sidebar-logo" style={{ padding: 0 }}>
          <span className="sidebar-logo-mark">✦</span>
          <span className="sidebar-logo-text">AIKYA</span>
        </Link>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <button className="icon-btn" onClick={toggle} title="Toggle theme">
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link to="/" className="btn btn-primary">Open App</Link>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <h1>
              ADITYA UNIVERSITY.
              <br />
              <span className="accent-text">SUBRAMPALEM · AIKYA.</span>
            </h1>
            <p className="hero-sub">
              The NAAC A+ accredited campus of Surampalem, Andhra Pradesh — reimagined
              as a digital twin. Every school, block, lab, bus route and event mapped,
              with an AI that actually understands it.
            </p>
            <div className="hero-stats">
              <div className="hero-stat"><strong>14+</strong><span>Departments & Schools</span></div>
              <div className="hero-stat"><strong>22+</strong><span>Campus Facilities</span></div>
              <div className="hero-stat"><strong>3</strong><span>Bus Routes</span></div>
              <div className="hero-stat"><strong>A+</strong><span>NAAC Accredited</span></div>
            </div>
            <div className="hero-cta">
              <Link to="/" className="btn btn-primary btn-lg">Explore Campus</Link>
              <Link to="/map" className="btn btn-lg">Open Live Map</Link>
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

        <section className="landing-section">
          <Reveal>
            <h2>Everything at Aditya University, <span className="accent-text">one place.</span></h2>
            <p className="section-sub">
              From the School of Engineering to School of Pharmacy — blocks, labs, people,
              food, transit, hostels, events and services, all mapped and connected to the
              campus intelligence layer.
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

        <section className="landing-cta">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2>Your campus. <span className="accent-text">Reimagined.</span></h2>
            <p className="section-sub" style={{ margin: '18px auto 30px' }}>
              AIKYA — the digital twin of Aditya University. Every connection, discoverable.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/" className="btn btn-primary btn-lg">Start Exploring</Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}