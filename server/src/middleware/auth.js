const jwt = require("jsonwebtoken");

function jwtSecret() {
  return process.env.JWT_SECRET || "campusx-dev-secret-change-me";
}

// Issues a signed JWT for the admin user.
function signToken(payload) {
  return jwt.sign(payload, jwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// Express middleware that guards write routes. Verifies the Bearer token from
// the Authorization header and puts the decoded payload on req.admin.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    req.admin = jwt.verify(token, jwtSecret());
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

module.exports = { signToken, requireAuth, jwtSecret };