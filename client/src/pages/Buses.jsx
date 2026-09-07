import { useNavigate } from "react-router-dom";
import { Clock, UserRound } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import { PageHeader, EmptyState, SkeletonGrid, StatusBadge } from "../components/ui.jsx";

export default function Buses() {
  const { data, loading } = useUniverse(["buses"]);
  const navigate = useNavigate();
  const buses = data.buses || [];

  return (
    <div>
      <PageHeader
        kicker="Transit"
        title="Campus Transport"
        sub="Bus routes, timings and drivers serving the campus."
      />

      {loading ? (
        <SkeletonGrid count={3} height={200} />
      ) : buses.length === 0 ? (
        <EmptyState icon="🚌" title="No routes available" subtitle="Bus routes will appear here once added." />
      ) : (
        <div className="grid grid-2">
          {buses.map((b) => (
            <div key={b._id} className="rich-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div className="rc-avatar">🚌</div>
                <div style={{ flex: 1 }}>
                  <h3>Route {b.routeNumber}</h3>
                  <StatusBadge status={b.status || "Running"} />
                </div>
              </div>

              <p className="muted">{b.routeDescription}</p>

              <div className="bus-route" style={{ padding: "4px 0" }}>
                {(b.stops || []).map((s, i) => (
                  <div key={s.name} className={`bus-stop${i === 0 ? " current" : ""}`}>
                    <span className="bs-line" />
                    <span className="bs-dot" />
                    <span style={{ flex: 1 }}>{s.name}</span>
                    <span className="muted">{s.time}</span>
                  </div>
                ))}
              </div>

              <div className="rc-rows">
                <div className="rc-row"><Clock size={14} /> Departs {b.departureTime} · Returns {b.returnTime}</div>
                <div className="rc-row"><UserRound size={14} /> {b.driverName} · {b.driverContact}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}