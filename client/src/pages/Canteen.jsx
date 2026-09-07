import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Navigation } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import { PageHeader, EmptyState, SkeletonGrid, Chip, StatusBadge } from "../components/ui.jsx";

export default function Canteen() {
  const { data, loading } = useUniverse(["pois"]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const shops = useMemo(() => (data.pois || []).filter((p) => p.type === "shop"), [data]);

  const filtered = shops.filter((s) => {
    if (filter === "open") return s.isOpenNow;
    if (filter === "closed") return !s.isOpenNow;
    return true;
  });

  return (
    <div>
      <PageHeader
        kicker="Food"
        title="Food & Shops"
        sub="Where to eat on campus — menus, prices and live availability."
      />

      <div className="chips" style={{ marginBottom: 20 }}>
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>All ({shops.length})</Chip>
        <Chip active={filter === "open"} onClick={() => setFilter("open")}>🟢 Open now</Chip>
        <Chip active={filter === "closed"} onClick={() => setFilter("closed")}>🔴 Closed</Chip>
      </div>

      {loading ? (
        <SkeletonGrid count={4} height={180} />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🍔" title="No food outlets right now" subtitle="Try checking the other filter." />
      ) : (
        <div className="grid grid-auto">
          {filtered.map((s) => (
            <div key={s._id} className="rich-card">
              <div className="rc-head">
                <div className="rc-avatar">🍔</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3>{s.name}</h3>
                  <div className="rc-sub" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <StatusBadge status={s.isOpenNow ? "open" : "closed"} />
                  </div>
                  <div className="rc-row" style={{ marginTop: 8 }}><Clock size={13} /> {s.openHours}</div>
                </div>
              </div>

              <ul className="menu-list">
                {(s.items || []).map((item) => (
                  <li key={item.name}>
                    <span className="menu-name">{item.name}</span>
                    {item.available ? (
                      <span className="menu-price">₹{item.price}</span>
                    ) : (
                      <span className="menu-sold">Sold out · ₹{item.price}</span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="rc-foot">
                <button className="btn btn-soft" onClick={() => navigate("/map")}><Navigation size={14} /> Navigate</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}