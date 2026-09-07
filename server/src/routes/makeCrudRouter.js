const express = require("express");
const { requireAuth } = require("../middleware/auth");

/**
 * Creates a basic CRUD router for a given Mongoose model.
 * GET    /            -> list all          (public)
 * GET    /:id         -> get one           (public)
 * POST   /            -> create            (admin only)
 * PUT    /:id         -> update            (admin only)
 * DELETE /:id         -> delete            (admin only)
 *
 * Write routes are protected by JWT auth (admin login); reads stay public so
 * the map, directories and chat continue to work for everyone.
 */
function makeCrudRouter(Model) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const items = await Model.find().sort({ createdAt: -1 });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/", requireAuth, async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.put("/:id", requireAuth, async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete("/:id", requireAuth, async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = makeCrudRouter;
