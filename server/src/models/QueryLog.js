const mongoose = require("mongoose");

const queryLogSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String },
    wasEscalated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QueryLog", queryLogSchema);
