import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function Buses() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    api.getBuses().then(setBuses).catch(() => setBuses([]));
  }, []);

  return (
    <div className="page">
      <h1>Transport</h1>
      <div className="card-grid">
        {buses.map((b) => (
          <div key={b._id} className="info-card">
            <h3>Bus {b.routeNumber}</h3>
            <p className="muted">{b.routeDescription}</p>
            <p>Departs: {b.departureTime} | Returns: {b.returnTime}</p>
            <p>Driver: {b.driverName} ({b.driverContact})</p>
            <p className="status-open">{b.status}</p>
            <ul className="menu-list">
              {(b.stops || []).map((s) => (
                <li key={s.name}>
                  <span>{s.name}</span>
                  <span>{s.time}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
