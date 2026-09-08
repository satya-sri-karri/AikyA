const mongoose = require("mongoose");

// Canonical daily teaching windows used to derive a faculty member's free time
// from their timetable. Each entry is { start, end } in 24h "HH:MM" format.
const DAY_WINDOW = { start: "09:00", end: "17:00" };

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const toMin = (hhmm) => {
  if (!hhmm || typeof hhmm !== "string") return null;
  const [h, m] = hhmm.split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
};

const to12h = (mins) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
};

// Convert a set of busy windows (24h "HH:MM") into free windows within the day.
// Returns strings like "11:00 AM - 1:00 PM".
function computeFreeSlots(busy) {
  const wStart = toMin(DAY_WINDOW.start);
  const wEnd = toMin(DAY_WINDOW.end);
  if (wStart === null || wEnd === null) return [];

  const sorted = busy
    .map((s) => ({ start: toMin(s.start), end: toMin(s.end) }))
    .filter((s) => s.start !== null && s.end !== null && s.end > s.start)
    .sort((a, b) => a.start - b.start);

  const free = [];
  let cursor = wStart;
  for (const slot of sorted) {
    if (slot.end <= cursor) continue; // already covered
    const cs = Math.max(cursor, slot.start);
    if (cs >= wEnd) break;
    if (cs > cursor) {
      free.push([cursor, Math.min(slot.start, wEnd)]);
    }
    cursor = Math.max(cursor, slot.end);
    if (cursor >= wEnd) break;
  }
  if (cursor < wEnd) free.push([cursor, wEnd]);

  return free
    .filter(([s, e]) => e - s >= 60) // ignore slots shorter than 1 hour
    .map(([s, e]) => `${to12h(s)} - ${to12h(e)}`);
}

const timetableSlotSchema = new mongoose.Schema(
  {
    start: { type: String }, // "HH:MM"
    end: { type: String }, // "HH:MM"
    subject: { type: String },
    room: { type: String },
  },
  { _id: false }
);

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    departmentName: { type: String }, // denormalized for fast AI context building
    designation: { type: String },
    cabin: { type: String },
    block: { type: String },
    floor: { type: String },
    email: { type: String },
    subjects: [{ type: String }],
    onLeave: { type: Boolean, default: false },
    // Optional self-service login. Will be hashed on save.
    passwordHash: { type: String, select: false },
    // Weekly teaching timetable: day -> list of { start, end, subject, room } (24h).
    timetable: {
      type: Map,
      of: [timetableSlotSchema],
      default: {},
    },
    // Derived availability updated whenever the timetable or onLeave changes.
    availableSlots: [{ type: String }], // e.g. ["2:00-3:00 PM", "4:00-5:00 PM"]
  },
  { timestamps: true }
);

const getDaySlots = (timetable, day) => {
  if (!timetable) return [];
  const slots = typeof timetable.get === "function" ? timetable.get(day) : timetable[day];
  return Array.isArray(slots) ? slots : [];
};

facultySchema.methods.refreshAvailability = function () {
  // Only derive availability when a timetable exists; otherwise keep the
  // hand-written demo availableSlots untouched.
  const hasTimetable = DAYS.some((d) => getDaySlots(this.timetable, d).length);
  if (!hasTimetable) return this;
  this.availableSlots = this.onLeave ? [] : this.weeklyFreeTime();
  return this;
};

// Per-day free windows for a given day label (e.g. "Monday").
facultySchema.methods.freeTimeFor = function (dayLabel) {
  if (this.onLeave) return [];
  const busy = getDaySlots(this.timetable, dayLabel)
    .filter((s) => s && s.start && s.end)
    .map((s) => ({ start: s.start, end: s.end }));
  return computeFreeSlots(busy);
};

// Aggregate free windows across the whole week (used for the public availability list).
facultySchema.methods.weeklyFreeTime = function () {
  if (this.onLeave) return [];
  const busy = [];
  for (const day of DAYS) {
    for (const s of getDaySlots(this.timetable, day)) {
      if (s && s.start && s.end) busy.push({ start: s.start, end: s.end });
    }
  }
  return computeFreeSlots(busy);
};

module.exports = mongoose.model("Faculty", facultySchema);
module.exports.DAYS = DAYS;
