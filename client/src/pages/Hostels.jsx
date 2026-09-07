import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Users } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import { PageHeader, EmptyState, SkeletonGrid } from "../components/ui.jsx";

export default function Hostels() {
  const { data, loading } = useUniverse(["pois"]);
  const navigate = useNavigate();
  const hostels = (data.pois || []).filter((p) => p.type === "hostel");

  return (
    <div>
      <PageHeader
        kicker="Residence"
        title="Hostels"
        sub="Residential blocks, wardens and current occupancy."
      />

      {loading ? (
        <SkeletonGrid count={3} height={190} />
      ) : hostels.length === 0 ? (
        <EmptyState icon="🏠" title="No hostels listed" subtitle="Hostel data will appear here once added." />
      ) : (
        <div className="grid grid-auto">
          {hostels.map((h) => {
            const occupancy = h.totalRooms ? ((h.totalRooms - h.vacantRooms) / h.totalRooms) * 100 : 0;
            return (
              <div key={h._id} className="rich-card">
                <div className="rc-head">
                  <div className="rc-avatar">🏠</div>
                  <div style={{ minWidth: 0 }}>
                    <h3>{h.name}</h3>
                    <div className="rc-sub">{h.hostelType === "girls" ? "Girls hostel" : h.hostelType === "boys" ? "Boys hostel" : "Hostel"}</div>
                  </div>
                </div>

                <div className="rc-rows">
                  <div className="rc-row"><Users size={14} /> {h.vacantRooms} vacant of {h.totalRooms} rooms</div>
                  <div className="rc-row"><MapPin size={14} /> {h.block}</div>
                  <div className="rc-row"><Phone size={14} /> {h.warden} · {h.contact}</div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                    <span className="muted">Occupancy</span>
                    <span className="muted">{Math.round(occupancy)}%</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 99, background: "var(--surface-3)", overflow: "hidden" }}>
                    <div
                      style={{ height: "100%", borderRadius: 99, width: `${occupancy}%`, background: "linear-gradient(90deg, var(--accent), var(--cyan))" }}
                    />
                  </div>
                </div>

                <div className="rc-foot">
                  <button className="btn btn-soft" onClick={() => navigate("/map")}>View on map</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}