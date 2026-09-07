const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true }, // "2026-09-10"
    startTime: { type: String },
    endTime: { type: String },
    venue: { type: String },
    organizer: { type: String },
    department: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
