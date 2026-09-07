const express = require("express");
const bcrypt = require("bcryptjs");
const { signToken, requireAuth } = require("../middleware/auth");

const router = express.Router();

// Hash the configured admin password once at startup so login compares against
// a bcrypt hash instead of the plaintext env value.
const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "", 10);

// POST /api/auth/login  { username, password } -> { token, username }
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminUser || !adminPass) {
    return res.status(500).json({
      error: "Admin account is not configured on the server. Set ADMIN_USERNAME and ADMIN_PASSWORD in the .env file.",
    });
  }

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  const userMatches = username === adminUser;
  const passMatches = adminUser ? bcrypt.compareSync(password, adminPasswordHash) : false;

  if (!userMatches || !passMatches) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = signToken({ role: "admin", username: adminUser });
  res.json({ token, username: adminUser });
});

// GET /api/auth/me  - returns the current admin if the token is valid.
router.get("/me", requireAuth, (req, res) => {
  res.json({ username: req.admin.username });
});

module.exports = router;