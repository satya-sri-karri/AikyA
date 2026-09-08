const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["192.168.0.1", "8.8.8.8"]);

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in .env");
  }
  await mongoose.connect(uri);
  console.log("MongoDB connected:", mongoose.connection.name);
}

module.exports = connectDB;
