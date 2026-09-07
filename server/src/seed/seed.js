require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Department = require("../models/Department");
const Faculty = require("../models/Faculty");
const PointOfInterest = require("../models/PointOfInterest");
const BusRoute = require("../models/BusRoute");
const Event = require("../models/Event");
const QueryLog = require("../models/QueryLog");

async function seed() {
  await connectDB();

  await Promise.all([
    Department.deleteMany({}),
    Faculty.deleteMany({}),
    PointOfInterest.deleteMany({}),
    BusRoute.deleteMany({}),
    Event.deleteMany({}),
    QueryLog.deleteMany({}),
  ]);

  const departments = await Department.insertMany([
    {
      name: "Artificial Intelligence & Machine Learning",
      code: "AIML",
      block: "C Block",
      floor: "2nd Floor",
      hod: "Dr. Ravi Kumar",
      labs: ["AI Lab", "ML Lab", "Deep Learning Lab"],
      contactEmail: "aiml@demo-campus.edu",
      officeHours: "9:00 AM - 5:00 PM",
    },
    {
      name: "Computer Science & Engineering",
      code: "CSE",
      block: "A Block",
      floor: "1st Floor",
      hod: "Dr. Lakshmi Prasanna",
      labs: ["Programming Lab", "Networks Lab"],
      contactEmail: "cse@demo-campus.edu",
      officeHours: "9:00 AM - 5:00 PM",
    },
    {
      name: "Electronics & Communication Engineering",
      code: "ECE",
      block: "B Block",
      floor: "Ground Floor",
      hod: "Dr. Suresh Babu",
      labs: ["VLSI Lab", "Signals Lab"],
      contactEmail: "ece@demo-campus.edu",
      officeHours: "9:00 AM - 5:00 PM",
    },
  ]);

  await Faculty.insertMany([
    {
      name: "Dr. Ravi Kumar",
      departmentId: departments[0]._id,
      departmentName: "AI & ML",
      designation: "Associate Professor",
      cabin: "C207",
      block: "C Block",
      floor: "2nd Floor",
      email: "ravi.kumar@demo-campus.edu",
      subjects: ["Machine Learning", "Deep Learning"],
      onLeave: false,
      availableSlots: ["2:00-3:00 PM", "4:00-5:00 PM"],
    },
    {
      name: "Dr. Anitha Reddy",
      departmentId: departments[0]._id,
      departmentName: "AI & ML",
      designation: "Assistant Professor",
      cabin: "C210",
      block: "C Block",
      floor: "2nd Floor",
      email: "anitha.reddy@demo-campus.edu",
      subjects: ["Natural Language Processing"],
      onLeave: true,
      availableSlots: [],
    },
    {
      name: "Dr. Lakshmi Prasanna",
      departmentId: departments[1]._id,
      departmentName: "CSE",
      designation: "Professor & HOD",
      cabin: "A105",
      block: "A Block",
      floor: "1st Floor",
      email: "lakshmi.p@demo-campus.edu",
      subjects: ["DBMS", "Operating Systems"],
      onLeave: false,
      availableSlots: ["11:00-12:00 PM"],
    },
    {
      name: "Dr. Suresh Babu",
      departmentId: departments[2]._id,
      departmentName: "ECE",
      designation: "Professor & HOD",
      cabin: "B002",
      block: "B Block",
      floor: "Ground Floor",
      email: "suresh.babu@demo-campus.edu",
      subjects: ["VLSI Design"],
      onLeave: false,
      availableSlots: ["3:00-4:00 PM"],
    },
  ]);

  await PointOfInterest.insertMany([
    {
      type: "block",
      name: "A Block",
      block: "A Block",
      latitude: 16.3067,
      longitude: 80.4365,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description: "Houses the CSE department and main classrooms.",
    },
    {
      type: "block",
      name: "B Block",
      block: "B Block",
      latitude: 16.307,
      longitude: 80.4368,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description: "Houses the ECE department.",
    },
    {
      type: "block",
      name: "C Block",
      block: "C Block",
      latitude: 16.3065,
      longitude: 80.437,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description: "Houses the AI & ML department and labs.",
    },
    {
      type: "library",
      name: "Central Library",
      block: "Library Block",
      latitude: 16.3072,
      longitude: 80.4363,
      openHours: "8:00 AM - 8:00 PM",
      isOpenNow: true,
      description: "Reading rooms, reference section, digital library.",
    },
    {
      type: "shop",
      name: "Main Canteen",
      block: "Near A Block",
      latitude: 16.3068,
      longitude: 80.4372,
      openHours: "8:00 AM - 7:00 PM",
      isOpenNow: true,
      items: [
        { name: "Idly", price: 30, available: true },
        { name: "Dosa", price: 40, available: true },
        { name: "Fried Rice", price: 80, available: false },
        { name: "Tea", price: 15, available: true },
      ],
    },
    {
      type: "shop",
      name: "Snacks Corner",
      block: "Near C Block",
      latitude: 16.3064,
      longitude: 80.4373,
      openHours: "9:00 AM - 6:00 PM",
      isOpenNow: true,
      items: [
        { name: "Samosa", price: 20, available: true },
        { name: "Cold Coffee", price: 35, available: true },
        { name: "Maggi", price: 45, available: true },
      ],
    },
    {
      type: "hostel",
      name: "Boys Hostel",
      block: "Hostel Block A",
      latitude: 16.308,
      longitude: 80.436,
      openHours: "24 hours",
      isOpenNow: true,
      hostelType: "boys",
      warden: "Mr. Venkat Rao",
      contact: "9876543210",
      totalRooms: 120,
      vacantRooms: 8,
    },
    {
      type: "hostel",
      name: "Girls Hostel",
      block: "Hostel Block B",
      latitude: 16.3082,
      longitude: 80.4358,
      openHours: "24 hours",
      isOpenNow: true,
      hostelType: "girls",
      warden: "Mrs. Padma Latha",
      contact: "9876543211",
      totalRooms: 100,
      vacantRooms: 3,
    },
    {
      type: "ground",
      name: "Mango Garden",
      block: "Behind C Block",
      latitude: 16.3062,
      longitude: 80.4371,
      openHours: "8:00 AM - 6:00 PM",
      isOpenNow: true,
      description: "Green space behind C Block.",
      accessPolicy: {
        allowedRoles: ["student"],
        restrictedRoles: [],
        startTime: "08:00",
        endTime: "18:00",
        note: "Boys only, as per campus administration policy, 8 AM to 6 PM.",
      },
    },
    {
      type: "office",
      name: "Accounts Office",
      block: "A Block",
      floor: "1st Floor",
      latitude: 16.3067,
      longitude: 80.4364,
      openHours: "9:00 AM - 4:00 PM",
      isOpenNow: true,
      description: "Fee payments and financial queries.",
    },
    {
      type: "service",
      name: "Medical Room",
      block: "Admin Block",
      latitude: 16.3069,
      longitude: 80.4366,
      openHours: "9:00 AM - 5:00 PM",
      isOpenNow: true,
      description: "First aid and basic medical assistance.",
    },
  ]);

  await BusRoute.insertMany([
    {
      routeNumber: "12A",
      routeDescription: "College -> Guntur -> Brodipet -> Lakshmipuram",
      stops: [
        { name: "College Gate", time: "8:00 AM" },
        { name: "Guntur Bus Stand", time: "8:25 AM" },
        { name: "Brodipet", time: "8:40 AM" },
        { name: "Lakshmipuram", time: "8:55 AM" },
      ],
      departureTime: "8:00 AM",
      returnTime: "4:30 PM",
      driverName: "Mr. Ramesh",
      driverContact: "9998887771",
      status: "On Route",
    },
    {
      routeNumber: "7B",
      routeDescription: "College -> Tenali Road -> Chandramoulipuram",
      stops: [
        { name: "College Gate", time: "8:15 AM" },
        { name: "Tenali Road", time: "8:45 AM" },
        { name: "Chandramoulipuram", time: "9:05 AM" },
      ],
      departureTime: "8:15 AM",
      returnTime: "4:45 PM",
      driverName: "Mr. Suribabu",
      driverContact: "9998887772",
      status: "On Route",
    },
  ]);

  await Event.insertMany([
    {
      title: "AI Hackathon 2026",
      description: "24-hour hackathon on applied AI projects.",
      date: "2026-09-10",
      startTime: "10:00 AM",
      endTime: "5:00 PM",
      venue: "Seminar Hall, C Block",
      organizer: "AI & ML Department",
      department: "AIML",
      category: "Technical",
    },
    {
      title: "Cultural Fest - Rhythms 2026",
      description: "Annual cultural festival with music, dance, and drama.",
      date: "2026-09-15",
      startTime: "4:00 PM",
      endTime: "9:00 PM",
      venue: "Main Ground",
      organizer: "Student Council",
      department: "General",
      category: "Cultural",
    },
  ]);

  console.log("Seed data inserted successfully.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
