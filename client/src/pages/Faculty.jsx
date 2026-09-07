import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function Faculty() {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    api.getFaculty().then(setFaculty).catch(() => setFaculty([]));
  }, []);

  return (
    <div className="page">
      <h1>Faculty directory</h1>
      <div className="card-grid">
        {faculty.map((f) => (
          <div key={f._id} className="info-card">
            <h3>{f.name}</h3>
            <p className="muted">{f.designation} - {f.departmentName}</p>
            <p>Cabin: {f.cabin} ({f.block}, {f.floor})</p>
            <p>Subjects: {(f.subjects || []).join(", ")}</p>
            <p className={f.onLeave ? "status-closed" : "status-open"}>
              {f.onLeave ? "On leave today" : "Available"}
            </p>
            {!f.onLeave && f.availableSlots?.length > 0 && (
              <p className="muted">Free: {f.availableSlots.join(", ")}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
