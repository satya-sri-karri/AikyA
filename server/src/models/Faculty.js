const mongoose = require("mongoose");

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
    // Simple demo-friendly availability instead of a full engine
    availableSlots: [{ type: String }], // e.g. ["2:00-3:00 PM", "4:00-5:00 PM"]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faculty", facultySchema);
