const express = require("express");
const bcrypt = require("bcryptjs");
const Faculty = require("../models/Faculty");
const { DAYS } = Faculty;
const { requireAuth, adminOnly } = require("../middleware/auth");

const router = express.Router();

const isAdmin = (req) => req.admin && req.admin.role === "admin";
const isSelf = (req, id) =>
  req.admin && req.admin.role === "faculty" && String(req.admin.sub) === String(id);

// Fields a faculty member may edit about themselves. Everything structural
// (name, department, block, cabin, availability) stays admin-managed.
const SELF_EDITABLE = ["designation", "email", "subjects", "onLeave"];

// Fields that only the admin may write, even on their own profile.
const ADMIN_ONLY = ["name", "departmentId", "departmentName", "cabin", "block", "floor", "availableSlots", "passwordHash"];

function pick(source, keys) {
  const out = {};
  for (const k of keys) if (source[k] !== undefined) out[k] = source[k];
  return out;
}

// GET / -> public list (same shape as the generic CRUD list, minus secrets)
router.get("/", async (req, res) => {
  try {
    const items = await Faculty.find().sort({ createdAt: -1 });
    const docs = items.map((f) => f.toObject({ getters: false }));
    // keep the same response the rest of the app expects; passwordHash is
    // select:false so it is already absent.
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /:id -> public one
router.get("/:id", async (req, res) => {
  try {
    const item = await Faculty.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:id/timetable -> public weekly timetable + free time derived from it.
// This is what powers "system automatically detects their free time".
router.get("/:id/timetable", async (req, res) => {
  try {
    const f = await Faculty.findById(req.params.id);
    if (!f) return res.status(404).json({ error: "Not found" });

    const timetable = {};
    const freeTime = {};
    for (const day of DAYS) {
      const slots = (f.timetable && (typeof f.timetable.get === "function" ? f.timetable.get(day) : f.timetable[day])) || [];
      timetable[day] = (slots || []).map((s) => ({ start: s.start, end: s.end, subject: s.subject, room: s.room }));
      freeTime[day] = f.freeTimeFor(day);
    }

    return res.json({
      name: f.name,
      departmentName: f.departmentName,
      onLeave: f.onLeave,
      timetable,
      freeTime,
      availableSlots: f.weeklyFreeTime(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST / -> admin only
router.post("/", adminOnly, async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.password) {
      body.passwordHash = bcrypt.hashSync(body.password, 10);
      delete body.password;
    }
    const item = await Faculty.create(body);
    item.refreshAvailability();
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /:id -> admin edits anyone; faculty edits themselves (structural fields blocked)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const item = await Faculty.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    if (!isAdmin(req) && !isSelf(req, item._id)) {
      return res.status(403).json({ error: "You can only edit your own profile" });
    }

    const changes = isAdmin(req) ? { ...req.body } : pick(req.body, SELF_EDITABLE);
    if (changes.password) {
      item.passwordHash = bcrypt.hashSync(changes.password, 10);
    }
    delete changes.password; // only ever set via a non-empty password
    delete changes.passwordHash; // never set directly from a request body

    const timetableChanged = "timetable" in changes && JSON.stringify(item.timetable) !== JSON.stringify(changes.timetable);
    const leaveChanged = "onLeave" in changes && item.onLeave !== !!changes.onLeave;

    item.set(changes);
    if (timetableChanged || leaveChanged) item.refreshAvailability();
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /:id/timetable -> admin or self; recomputes free time automatically.
// Body: { timetable: { Monday: [{ start, end, subject, room }], ... }, onLeave? }
router.put("/:id/timetable", requireAuth, async (req, res) => {
  try {
    const item = await Faculty.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    if (!isAdmin(req) && !isSelf(req, item._id)) {
      return res.status(403).json({ error: "You can only update your own timetable" });
    }

    const incoming = req.body && (req.body.timetable || req.body);
    const timetable = {};
    for (const day of DAYS) {
      timetable[day] = Array.isArray(incoming[day]) ? incoming[day] : [];
    }
    item.timetable = timetable;
    if (req.body && typeof req.body.onLeave === "boolean") item.onLeave = req.body.onLeave;
    item.refreshAvailability();
    await item.save();

    res.json({
      timetable,
      freeTime: Object.fromEntries(DAYS.map((d) => [d, item.freeTimeFor(d)])),
      availableSlots: item.weeklyFreeTime(),
      onLeave: item.onLeave,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /:id -> admin only
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const item = await Faculty.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;