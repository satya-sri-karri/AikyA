import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

const QUICK_ACTIONS = [
  { label: "Campus Map", to: "/map" },
  { label: "Find Faculty", to: "/faculty" },
  { label: "Departments", to: "/departments" },
  { label: "Food & Shops", to: "/canteen" },
  { label: "Hostels", to: "/hostels" },
  { label: "Transport", to: "/buses" },
  { label: "Events", to: "/events" },
];

export default function Dashboard() {
  const [pois, setPois] = useState([]);

  useEffect(() => {
    api.getPOIs().then(setPois).catch(() => setPois([]));
  }, []);

  const statusItems = pois.filter((p) =>
    ["library", "shop", "ground", "service"].includes(p.type)
  );

  return (
    <div className="page">
      <h1>Good morning</h1>
      <p className="muted">Here's what's happening on campus today.</p>

      <section className="card-grid">
        {QUICK_ACTIONS.map((a) => (
          <Link key={a.to} to={a.to} className="quick-action-card">
            {a.label}
          </Link>
        ))}
      </section>

      <section>
        <h2>Campus status</h2>
        <ul className="status-list">
          {statusItems.map((p) => (
            <li key={p._id}>
              <span>{p.name}</span>
              <span className={p.isOpenNow ? "status-open" : "status-closed"}>
                {p.isOpenNow ? "Open" : "Closed"}
              </span>
            </li>
          ))}
          {statusItems.length === 0 && <li className="muted">No status data yet - run the seed script.</li>}
        </ul>
      </section>
    </div>
  );
}
