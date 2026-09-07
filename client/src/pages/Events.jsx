import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import { PageHeader, EmptyState, SkeletonGrid, Chip } from "../components/ui.jsx";

const DAY_MONTH = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function formatDate(dateStr) {
  const [y, m, d] = (dateStr || "").split("-");
  if (!d) return null;
  return { day: d, month: DAY_MONTH[(Number(m) || 1) - 1] };
}

export default function Events() {
  const { data, loading } = useUniverse(["events"]);
  const [cat, setCat] = useState("all");
  const navigate = useNavigate();
  const events = data.events || [];

  const cats = useMemo(() => [...new Set(events.map((e) => e.category).filter(Boolean))], [events]);
  const filtered = events.filter((e) => cat === "all" || e.category === cat);

  return (
    <div>
      <PageHeader
        kicker="Calendar"
        title="Campus Events"
        sub="Tech, sports, cultural and workshops happening across the campus."
      />

      {events.length > 0 && (
        <div className="chips" style={{ marginBottom: 20 }}>
          <Chip active={cat === "all"} onClick={() => setCat("all")}>All</Chip>
          {cats.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
          ))}
        </div>
      )}

      {loading ? (
        <SkeletonGrid count={4} height={150} />
      ) : filtered.length === 0 ? (
        <EmptyState icon="📅" title="Nothing happening yet" subtitle="We'll let you know when something is scheduled." />
      ) : (
        <div className="grid grid-auto">
          {filtered.map((e) => {
            const fd = formatDate(e.date);
            return (
              <div key={e._id} className="rich-card event-card">
                {fd && (
                  <div className="event-date">
                    <div className="ed-mon">{fd.month}</div>
                    <div className="ed-day">{fd.day}</div>
                  </div>
                )}
                <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span className="badge badge-accent">{e.category || "Event"}</span>
                    {e.department && <span className="badge">{e.department}</span>}
                  </div>
                  <h3 style={{ fontSize: 17 }}>{e.title}</h3>
                  <p className="muted" style={{ fontSize: 13 }}>{e.description}</p>
                  <div className="rc-row"><MapPin size={14} /> {e.venue} · {e.startTime}–{e.endTime}</div>
                  <div className="rc-row">
                    <span style={{ color: "var(--text-faint)" }}>Organized by {e.organizer}</span>
                  </div>
                  <div className="rc-foot">
                    <button className="btn btn-soft" onClick={() => navigate("/map")}>View on map</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}