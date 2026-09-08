import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIOD_PRESETS = [
  { start: "09:00", end: "10:00" },
  { start: "10:00", end: "11:00" },
  { start: "11:00", end: "12:00" },
  { start: "12:00", end: "13:00" },
  { start: "14:00", end: "15:00" },
  { start: "15:00", end: "16:00" },
  { start: "16:00", end: "17:00" },
];

function Chip({ children, tone = "auto" }) {
  return (
    <span
      className="faculty-chip"
      style={tone === "green" ? { backgroundColor: "var(--success-soft)", color: "var(--success)" } : undefined}
    >
      {children}
    </span>
  );
}

function AvailabilitySummary({ tt }) {
  if (!tt) return null;
  if (tt.onLeave) return <div className="faculty-banner off">On leave — not available for classes right now. Toggle this off in your timetable or profile to go back online.</div>;
  const weekly = tt.availableSlots && tt.availableSlots.length ? tt.availableSlots : ["No free window of an hour or more (update your timetable to free up time)"];
  return (
    <div className="faculty-banner ok">
      <div>
        <strong>Your detected free time</strong>
        <div className="faculty-chip-row">
          {weekly.map((s, i) => (
            <Chip key={i} tone="green">{s}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePanel({ faculty, onSaved, isAdmin }) {
  const { toast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      designation: faculty.designation || "",
      email: faculty.email || "",
      subjects: (faculty.subjects || []).join(", "),
      onLeave: !!faculty.onLeave,
    });
  }, [faculty]);

  if (!form) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === "onLeave" ? e.target.checked : e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.update("faculty", faculty._id, {
        designation: form.designation,
        email: form.email,
        subjects: form.subjects.split(",").map((s) => s.trim()).filter(Boolean),
        onLeave: form.onLeave,
      });
      onSaved && onSaved();
      toast("Profile updated");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="faculty-grid">
      <div className="faculty-card">
        <h3>Personal details</h3>
        <div className="faculty-meta">
          <p><span>Name</span><strong>{faculty.name}</strong></p>
          <p><span>Department</span><strong>{faculty.departmentName}</strong></p>
          <p><span>Cabin</span><strong>{faculty.cabin || "—"} · {faculty.floor || "—"} · {faculty.block}</strong></p>
        </div>
      </div>

      <form className="faculty-card" onSubmit={handleSave}>
        <h3>Edit my details</h3>
        {!isAdmin && (
          <p className="faculty-note">Structural fields (name, department, cabin, block) are managed by the campus admin.</p>
        )}
        <label className="admin-field">
          <span>Designation</span>
          <input value={form.designation} onChange={set("designation")} />
        </label>
        <label className="admin-field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={set("email")} />
        </label>
        <label className="admin-field">
          <span>Subjects (comma separated)</span>
          <input value={form.subjects} onChange={set("subjects")} />
        </label>
        <label className="admin-field admin-check">
          <input type="checkbox" checked={form.onLeave} onChange={set("onLeave")} />
          <span>I am currently on leave (auto-marked unavailable)</span>
        </label>
        {error && <div className="admin-error">{error}</div>}
        <div className="admin-form-actions">
          <button type="submit" className="admin-btn primary" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

function DayColumn({ day, slots, onChange }) {
  const updateSlot = (idx, key, value) => {
    const next = slots.map((s, i) => (i === idx ? { ...s, [key]: value } : s));
    onChange(next);
  };
  const removeSlot = (idx) => onChange(slots.filter((_, i) => i !== idx));
  const addSlot = () => {
    const p = PERIOD_PRESETS[slots.length % PERIOD_PRESETS.length];
    onChange([...slots, { start: p.start, end: p.end, subject: "", room: "" }]);
  };

  return (
    <div className={`faculty-day ${day === "Saturday" ? "sat" : ""}`}>
      <div className="faculty-day-head">
        <span>{day}</span>
        <button type="button" className="admin-add-stop" onClick={addSlot}>＋</button>
      </div>
      <div className="faculty-slot-list">
        {slots.length === 0 && <div className="faculty-empty">Free all day</div>}
        {slots.map((s, i) => (
          <div className="faculty-slot" key={i}>
            <div className="faculty-slot-times">
              <input type="time" value={s.start || ""} onChange={(e) => updateSlot(i, "start", e.target.value)} />
              <span>–</span>
              <input type="time" value={s.end || ""} onChange={(e) => updateSlot(i, "end", e.target.value)} />
            </div>
            <input className="faculty-subject" placeholder="Subject" value={s.subject || ""} onChange={(e) => updateSlot(i, "subject", e.target.value)} />
            <input className="faculty-room" placeholder="Room" value={s.room || ""} onChange={(e) => updateSlot(i, "room", e.target.value)} />
            <button type="button" className="admin-icon-btn" onClick={() => removeSlot(i)} title="Remove">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimetablePanel({ faculty, isAdmin }) {
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    api
      .getFacultyTimetable(faculty._id)
      .then((res) => {
        setData(res);
        setDraft(DAYS.map((d) => [d, (res.timetable[d] || []).map((s) => ({ ...s }))]));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faculty._id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!loaded) return <div className="muted">Loading timetable...</div>;
  if (error && !data) return <div className="admin-error">{error}</div>;

  const setDay = (day) => (slots) => setDraft((d) => d.map(([dd, ss]) => (dd === day ? [dd, slots] : [dd, ss])));

  async function save() {
    setSaving(true);
    setError("");
    const timetable = {};
    for (const [day, slots] of draft) {
      timetable[day] = slots
        .filter((s) => s.start && s.end)
        .map((s) => ({ start: s.start, end: s.end, subject: s.subject, room: s.room }));
    }
    try {
      const res = await api.updateFacultyTimetable(faculty._id, timetable, data?.onLeave);
      setData((prev) => ({ ...prev, timetable: res.timetable, freeTime: res.freeTime, availableSlots: res.availableSlots }));
      toast("Timetable saved — availability updated");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="faculty-tt">
      <div className="faculty-tt-head">
        <div>
          <h3>My weekly timetable</h3>
          <p className="faculty-note">Fill the periods you teach — your free time below is detected automatically.</p>
        </div>
        <button className="admin-btn primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save timetable"}
        </button>
      </div>

      <AvailabilitySummary tt={data} />

      {error && <div className="admin-error">{error}</div>}

      <div className="faculty-week">
        {DAYS.map((day, idx) => {
          const slots = draft[idx][1];
          return (
            <div key={day} className="faculty-day-col">
              <DayColumn day={day} slots={slots} onChange={setDay(day)} />
              <div className="faculty-free">
                <span>Detected free</span>
                {data?.freeTime?.[day]?.length
                  ? data.freeTime[day].map((t, i) => <Chip key={i} tone="green">{t}</Chip>)
                  : <span className="muted">–</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FacultyPortal({ facultyId, onLogout }) {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState(null);
  const [tab, setTab] = useState("profile");
  const [error, setError] = useState("");

  const loadProfile = useCallback(() => {
    api
      .getFaculty()
      .then((list) => {
        const rec = list.find((f) => String(f._id) === String(facultyId || user?.id));
        if (!rec) throw new Error("Faculty record not found");
        setFaculty(rec);
      })
      .catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facultyId, user?.id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (error) return <div className="admin-error">{error}</div>;
  if (!faculty) return <div className="muted">Loading profile...</div>;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Faculty Portal</h1>
          <p className="muted" style={{ margin: 0 }}>{faculty.name} · {faculty.departmentName} · {faculty.cabin || faculty.block}</p>
        </div>
        <div className="admin-header-right">
          <span className="muted">Signed in as <strong>{user?.username}</strong></span>
          {onLogout && <button className="admin-btn" onClick={onLogout}>Log out</button>}
        </div>
      </header>
      <nav className="admin-tabs">
        <button className={`admin-tab ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>My profile</button>
        <button className={`admin-tab ${tab === "timetable" ? "active" : ""}`} onClick={() => setTab("timetable")}>Timetable &amp; availability</button>
      </nav>
      <main className="admin-main">
        {tab === "profile" && <ProfilePanel faculty={faculty} onSaved={loadProfile} />}
        {tab === "timetable" && <TimetablePanel faculty={faculty} />}
      </main>
    </div>
  );
}