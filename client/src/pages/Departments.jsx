import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    api.getDepartments().then(setDepartments).catch(() => setDepartments([]));
  }, []);

  return (
    <div className="page">
      <h1>Departments</h1>
      <div className="card-grid">
        {departments.map((d) => (
          <div key={d._id} className="info-card">
            <h3>{d.name}</h3>
            <p className="muted">{d.block}, {d.floor}</p>
            <p>HOD: {d.hod}</p>
            <p>Labs: {(d.labs || []).join(", ")}</p>
            <p className="muted">Office hours: {d.officeHours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
