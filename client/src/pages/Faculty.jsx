import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, GraduationCap } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import { PageHeader, EmptyState, SkeletonGrid, Chip, StatusBadge } from "../components/ui.jsx";

export default function Faculty() {
  const { data, loading, refresh } = useUniverse();
  const [dept, setDept] = useState("all");
  const [avail, setAvail] = useState("all");
  const navigate = useNavigate();

  useEffect(() => { refresh(); }, []);

  const faculty = data.faculty || [];
  const departments = useMemo(() => [...new Set(faculty.map((f) => f.departmentName).filter(Boolean))], [faculty]);

  const filtered = faculty.filter((f) => {
    const dOk = dept === "all" || f.departmentName === dept;
    const aOk = avail === "all" || (avail === "free" ? !f.onLeave : f.onLeave);
    return dOk && aOk;
  });

  return (
    <div>
      <PageHeader
        kicker="People"
        title="Faculty Directory"
        sub="Profiles, departments and live availability across the campus."
      />

      <div className="chips" style={{ marginBottom: 20 }}>
        <Chip active={dept === "all"} onClick={() => setDept("all")}>All departments</Chip>
        {departments.map((d) => (
          <Chip key={d} active={dept === d} onClick={() => setDept(d)}>{d}</Chip>
        ))}
        <span style={{ width: 10 }} />
        <Chip active={avail === "all"} onClick={() => setAvail("all")}>All</Chip>
        <Chip active={avail === "free"} onClick={() => setAvail("free")}>🟢 Available</Chip>
        <Chip active={avail === "leave"} onClick={() => setAvail("leave")}>🔴 On leave</Chip>
      </div>

      {loading ? (
        <SkeletonGrid count={4} height={168} />
      ) : filtered.length === 0 ? (
        <EmptyState icon="👨‍🏫" title="No faculty matched" subtitle="Try changing the filters." />
      ) : (
        <div className="grid grid-auto">
          {filtered.map((f) => (
            <div key={f._id} className="rich-card">
              <div className="rc-head">
                <div className="rc-avatar">👨‍🏫</div>
                <div style={{ minWidth: 0 }}>
                  <h3>{f.name}</h3>
                  <div className="rc-sub">{f.designation} · {f.departmentName}</div>
                  <div style={{ marginTop: 6 }}>
                    <StatusBadge status={f.onLeave ? "On leave" : "Available"} />
                  </div>
                </div>
              </div>
              <div className="rc-rows">
                <div className="rc-row"><MapPin size={14} /> {f.cabin} · {f.block}, {f.floor}</div>
                <div className="rc-row"><GraduationCap size={14} /> {(f.subjects || []).join(", ")}</div>
                {!f.onLeave && f.availableSlots?.length > 0 ? (
                  <div className="rc-row"><Clock size={14} /> Free: {f.availableSlots.join(" · ")}</div>
                ) : (
                  <div className="rc-row"><Clock size={14} /> Not accepting slots today</div>
                )}
              </div>
              <div className="rc-foot">
                <button className="btn btn-soft" onClick={() => navigate("/map")}>Navigate</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}