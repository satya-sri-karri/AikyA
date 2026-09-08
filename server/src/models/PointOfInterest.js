const mongoose = require("mongoose");

const poiSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["shop", "hostel", "block", "library", "office", "ground", "service"],
      required: true,
    },
    name: { type: String, required: true },
    block: { type: String },
    floor: { type: String },
    area: { type: String }, // e.g. "Main Campus" | "Girls Hostel" | "Boys Hostel" | "Faculty Block"
    areaGroup: { type: String }, // optional sub-group e.g. "Street Food Stalls"
    latitude: { type: Number },
    longitude: { type: Number },
    openHours: { type: String },
    isOpenNow: { type: Boolean, default: true }, // demo flag, toggled by admin
    description: { type: String },

    // shop-specific
    items: [
      {
        name: String,
        price: { type: String }, // e.g. "₹20", "₹10–30", "Varies by day"
        available: { type: Boolean, default: true },
      },
    ],

    // hostel-specific
    hostelType: { type: String, enum: ["boys", "girls", null], default: null },
    warden: { type: String },
    contact: { type: String },
    totalRooms: { type: Number },
    vacantRooms: { type: Number },

    // access policy (kept flexible per the digital-twin design principle)
    accessPolicy: {
      allowedRoles: [{ type: String }], // e.g. ["student", "faculty"]
      restrictedRoles: [{ type: String }],
      startTime: { type: String }, // e.g. "08:00"
      endTime: { type: String }, // e.g. "18:00"
      note: { type: String },
    },

    // Building / branch allocation (editable by admin, changes each year)
    allocation: {
      institution: { type: String },
      branches: { type: [String] },
      years: { type: String },
      status: { type: String }, // e.g. "Proposed" | "Verified"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PointOfInterest", poiSchema);
