import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function Hostels() {
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    api
      .getPOIs()
      .then((pois) => setHostels(pois.filter((p) => p.type === "hostel")))
      .catch(() => setHostels([]));
  }, []);

  return (
    <div className="page">
      <h1>Hostels</h1>
      <div className="card-grid">
        {hostels.map((h) => (
          <div key={h._id} className="info-card">
            <h3>{h.name}</h3>
            <p className="muted">{h.hostelType} hostel - {h.block}</p>
            <p>Warden: {h.warden} ({h.contact})</p>
            <p>Vacant rooms: {h.vacantRooms} / {h.totalRooms}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
