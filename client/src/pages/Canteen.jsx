import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Navigation } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import { PageHeader, EmptyState, SkeletonGrid, Chip, StatusBadge, formatPrice } from "../components/ui.jsx";

const AREA_ORDER = ["Main Campus", "Girls Hostel", "Boys Hostel", "Faculty Block"];

export default function Canteen() {
  const { data, loading } = useUniverse(["pois"]);
  const [area, setArea] = useState("all");
  const navigate = useNavigate();

  const shops = useMemo(() => (data.pois || []).filter((p) => p.type === "shop"), [data]);
  const areas = useMemo(() => {
    const set = new Set(shops.map((s) => s.area).filter(Boolean));
    return ["all", ...AREA_ORDER.filter((a) => set.has(a)), ...[...set].filter((a) => !AREA_ORDER.includes(a))];
  }, [shops]);

  const filtered = shops.filter((s) => area === "all" || s.area === area);

  return (
    <div>
      <PageHeader
        kicker="Food"
        title="Food & Shops"
        sub="Where to eat on campus — menus, prices and live availability."
      />

      <div className="chips" style={{ marginBottom: 20 }}>
        {areas.map((a) => (
          <Chip key={a} active={area === a} onClick={() => setArea(a)}>
            {a === "all" ? `All (${shops.length})` : a}
          </Chip>
        ))}
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
                  <div className="rc-sub" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <StatusBadge status={s.isOpenNow ? "open" : "closed"} />
                    {s.areaGroup && <span className="badge badge-info" title="Group">{s.areaGroup}</span>}
                    {s.area && <span className="badge badge-info" title="Area">{s.area}</span>}
                  </div>
                  <div className="rc-row" style={{ marginTop: 8 }}><Clock size={13} /> {s.openHours}</div>
                </div>
              </div>

              <ul className="menu-list">
                {(s.items || []).map((item) => (
                  <li key={item.name}>
                    <span className="menu-name">{item.name}</span>
                    {item.available ? (
                      <span className="menu-price">{formatPrice(item.price)}</span>
                    ) : (
                      <span className="menu-sold">Sold out · {formatPrice(item.price)}</span>
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