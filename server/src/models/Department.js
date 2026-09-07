const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    block: { type: String, required: true },
    floor: { type: String, required: true },
    hod: { type: String },
    labs: [{ type: String }],
    contactEmail: { type: String },
    officeHours: { type: String, default: "9:00 AM - 5:00 PM" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
