import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.getEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  return (
    <div className="page">
      <h1>Events</h1>
      <div className="card-grid">
        {events.map((e) => (
          <div key={e._id} className="info-card">
            <h3>{e.title}</h3>
            <p className="muted">{e.date} - {e.startTime} to {e.endTime}</p>
            <p>{e.venue}</p>
            <p className="muted">Organized by {e.organizer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
