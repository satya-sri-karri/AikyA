import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function Canteen() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    api
      .getPOIs()
      .then((pois) => setShops(pois.filter((p) => p.type === "shop")))
      .catch(() => setShops([]));
  }, []);

  return (
    <div className="page">
      <h1>Food & shops</h1>
      <div className="card-grid">
        {shops.map((s) => (
          <div key={s._id} className="info-card">
            <h3>{s.name}</h3>
            <p className={s.isOpenNow ? "status-open" : "status-closed"}>
              {s.isOpenNow ? "Open" : "Closed"} - {s.openHours}
            </p>
            <ul className="menu-list">
              {(s.items || []).map((item) => (
                <li key={item.name}>
                  <span>{item.name}</span>
                  <span>Rs.{item.price}</span>
                  <span className={item.available ? "status-open" : "status-closed"}>
                    {item.available ? "" : "sold out"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
