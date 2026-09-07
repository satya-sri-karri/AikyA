const mongoose = require("mongoose");

const busRouteSchema = new mongoose.Schema(
  {
    routeNumber: { type: String, required: true },
    routeDescription: { type: String }, // e.g. "College -> Guntur -> XYZ"
    stops: [
      {
        name: String,
        time: String,
      },
    ],
    departureTime: { type: String },
    returnTime: { type: String },
    driverName: { type: String },
    driverContact: { type: String },
    status: { type: String, default: "On Route" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusRoute", busRouteSchema);
