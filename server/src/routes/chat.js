const express = require("express");

const QueryLog = require("../models/QueryLog");
const { retrieveCampusContext } = require("../services/campusDataService");
const {
  answerCampusQuestion,
  FALLBACK_MESSAGE,
} = require("../services/aiService");

const router = express.Router();

// Simple confidence heuristic for the escalation flow.
// Matches the phrasing our system prompt asks Grok to use when data is missing.
const ESCALATION_PATTERN =
  /don't have that information|not currently available|information is not available|not sure|contact the relevant department/i;

// Pipeline: user question -> intent/query understanding -> MongoDB retrieval
// -> relevant context -> Grok -> natural language answer.
router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    const { intents, context } = await retrieveCampusContext(message);

    const answerText = await answerCampusQuestion({
      question: message,
      context,
    });

    const wasEscalated = ESCALATION_PATTERN.test(answerText);

    await QueryLog.create({ question: message, answer: answerText, wasEscalated });

    console.log(`[ai] answered "${message}" (intents: ${intents.join(", ") || "general"})`);

    res.json({ answer: answerText, escalated: wasEscalated });
  } catch (err) {
    // Log a safe message only - never the API key or internal stack traces.
    console.error("Campus AI error:", err.message);
    res.json({ answer: FALLBACK_MESSAGE, escalated: false });
  }
});

// Simple analytics endpoint for the admin dashboard
router.get("/analytics", async (req, res) => {
  try {
    const total = await QueryLog.countDocuments();
    const escalated = await QueryLog.countDocuments({ wasEscalated: true });
    const recent = await QueryLog.find().sort({ createdAt: -1 }).limit(20);
    res.json({ total, escalated, recent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;