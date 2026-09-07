require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const makeCrudRouter = require("./routes/makeCrudRouter");

const Department = require("./models/Department");
const Faculty = require("./models/Faculty");
const PointOfInterest = require("./models/PointOfInterest");
const BusRoute = require("./models/BusRoute");
const Event = require("./models/Event");

const chatRoutes = require("./routes/chat");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/departments", makeCrudRouter(Department));
app.use("/api/faculty", makeCrudRouter(Faculty));
app.use("/api/poi", makeCrudRouter(PointOfInterest));
app.use("/api/buses", makeCrudRouter(BusRoute));
app.use("/api/events", makeCrudRouter(Event));
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`CampusX server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
