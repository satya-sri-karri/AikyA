import { useNavigate } from "react-router-dom";
import { Building2, Clock, FlaskConical, Mail } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import { PageHeader, EmptyState, SkeletonGrid } from "../components/ui.jsx";

export default function Departments() {
  const { data, loading } = useUniverse(["departments"]);
  const navigate = useNavigate();
  const departments = data.departments || [];

  return (
    <div>
      <PageHeader
        kicker="Academics"
        title="Departments"
        sub="Every academic department, its home block and its facilities."
      />

      {loading ? (
        <SkeletonGrid count={4} height={170} />
      ) : departments.length === 0 ? (
        <EmptyState icon="🏢" title="No departments yet" subtitle="Run the seed script to load campus data." />
      ) : (
        <div className="grid grid-auto">
          {departments.map((d) => (
            <div key={d._id} className="rich-card">
              <div className="rc-head">
                <div className="rc-avatar"><Building2 size={22} /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <h3>{d.name}</h3>
                    <span className="badge badge-accent">{d.code}</span>
                  </div>
                  <div className="rc-sub">HOD · {d.hod}</div>
                </div>
              </div>
              <div className="rc-rows">
                <div className="rc-row"><MapPinIcon /> {d.block} · {d.floor}</div>
                <div className="rc-row"><Mail size={14} /> {d.contactEmail}</div>
                <div className="rc-row"><Clock size={14} /> {d.officeHours}</div>
              </div>
              {(d.labs || []).length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {d.labs.map((lab) => (
                    <span key={lab} className="badge"><FlaskConical size={12} /> {lab}</span>
                  ))}
                </div>
              )}
              <div className="rc-foot">
                <button className="btn btn-soft" onClick={() => navigate("/map")}>View on map</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}