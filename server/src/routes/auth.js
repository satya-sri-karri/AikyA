const express = require("express");
const bcrypt = require("bcryptjs");
const { signToken, requireAuth } = require("../middleware/auth");
const Faculty = require("../models/Faculty");

const router = express.Router();

// Hash the configured admin password once at startup so login compares against
// a bcrypt hash instead of the plaintext env value.
const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "", 10);

// POST /api/auth/login  { username, password } -> { token, role, ... }
// The same form accepts either an admin username (env ADMIN_USERNAME) or a
// faculty email (row in the Faculty collection). Tooltips on the login form
// tell users which to type.
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  // 1) Admin credential path (env-configured account)
  if (adminUser && username === adminUser && adminPass && bcrypt.compareSync(password, adminPasswordHash)) {
    const token = signToken({ role: "admin", sub: adminUser, username: adminUser });
    return res.json({ token, role: "admin", username: adminUser });
  }

  // 2) Faculty path (email-based row in the Faculty collection)
  try {
    const faculty = await Faculty.findOne({ email: username }).select("+passwordHash");
    if (faculty && faculty.passwordHash && bcrypt.compareSync(password, faculty.passwordHash)) {
      const token = signToken({
        role: "faculty",
        sub: String(faculty._id),
        username: faculty.email,
      });
      return res.json({
        token,
        role: "faculty",
        username: faculty.email,
        name: faculty.name,
        facultyId: String(faculty._id),
        departmentName: faculty.departmentName,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Login failed. Please try again." });
  }

  return res.status(401).json({ error: "Invalid email/username or password" });
});

// GET /api/auth/me - returns the current principal if the token is valid.
router.get("/me", requireAuth, (req, res) => {
  const a = req.admin;
  if (a.role === "admin") return res.json({ role: "admin", username: a.username, sub: a.sub });
  res.json({ role: "faculty", username: a.username, sub: a.sub });
});

module.exports = router;