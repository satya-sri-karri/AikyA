// Field schema used by the generic admin CRUD forms.
// Field types:
//   text     -> single line input
//   textarea -> multiline input
//   number   -> numeric input
//   checkbox -> boolean toggle
//   select   -> dropdown, requires `options`
//   list     -> comma-separated input stored as an array of strings
//   stops    -> editable rows of { name, time } (bus routes)
// A dotted `name` (e.g. "accessPolicy.note") is stored as a nested object.

const POI_TYPES = ["shop", "hostel", "block", "library", "office", "ground", "service"];

export const ENTITIES = [
  {
    key: "poi",
    label: "Blocks & Places",
    description: "Blocks, shops, hostels, library, offices, grounds",
    fields: [
      { name: "type", label: "Type", type: "select", options: POI_TYPES },
      { name: "name", label: "Name", type: "text" },
      { name: "block", label: "Block / Building", type: "text" },
      { name: "floor", label: "Floor", type: "text" },
      { name: "area", label: "Area (Main Campus / Girls Hostel / Boys Hostel / Faculty Block)", type: "text" },
      { name: "areaGroup", label: "Area sub-group (e.g. Street Food Stalls)", type: "text" },
      { name: "openHours", label: "Open hours", type: "text" },
      { name: "isOpenNow", label: "Currently open", type: "checkbox" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "hostelType", label: "Hostel type", type: "select", options: ["", "boys", "girls"] },
      { name: "warden", label: "Warden", type: "text" },
      { name: "contact", label: "Contact", type: "text" },
      { name: "totalRooms", label: "Total rooms", type: "number" },
      { name: "vacantRooms", label: "Vacant rooms", type: "number" },
      { name: "accessPolicy.allowedRoles", label: "Access allowed roles (comma separated)", type: "list" },
      { name: "accessPolicy.restrictedRoles", label: "Access restricted roles (comma separated)", type: "list" },
      { name: "accessPolicy.startTime", label: "Access start time", type: "text" },
      { name: "accessPolicy.endTime", label: "Access end time", type: "text" },
      { name: "accessPolicy.note", label: "Access policy note", type: "textarea" },
      { name: "allocation.institution", label: "Allocation · Institution", type: "text" },
      { name: "allocation.branches", label: "Allocation · Branches (comma separated)", type: "list" },
      { name: "allocation.years", label: "Allocation · Years", type: "text" },
      { name: "allocation.status", label: "Allocation · Status (Proposed/Verified)", type: "text" },
    ],
  },
  {
    key: "departments",
    label: "Departments",
    description: "Academic departments and their labs",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "code", label: "Code", type: "text" },
      { name: "block", label: "Block", type: "text" },
      { name: "floor", label: "Floor", type: "text" },
      { name: "hod", label: "Head of Department", type: "text" },
      { name: "contactEmail", label: "Contact email", type: "text" },
      { name: "officeHours", label: "Office hours", type: "text" },
      { name: "labs", label: "Labs (comma separated)", type: "list" },
    ],
  },
  {
    key: "faculty",
    label: "Faculty",
    description: "Faculty members, subjects and availability",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "departmentName", label: "Department", type: "text" },
      { name: "designation", label: "Designation", type: "text" },
      { name: "cabin", label: "Cabin", type: "text" },
      { name: "block", label: "Block", type: "text" },
      { name: "floor", label: "Floor", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "password", label: "Login password (faculty self-service)", type: "text" },
      { name: "subjects", label: "Subjects (comma separated)", type: "list" },
      { name: "availableSlots", label: "Available slots (comma separated)", type: "list" },
      { name: "onLeave", label: "On leave", type: "checkbox" },
    ],
  },
  {
    key: "buses",
    label: "Bus Routes",
    description: "Transport routes, stops and drivers",
    fields: [
      { name: "routeNumber", label: "Route number", type: "text" },
      { name: "routeDescription", label: "Route description", type: "textarea" },
      { name: "departureTime", label: "Departure time", type: "text" },
      { name: "returnTime", label: "Return time", type: "text" },
      { name: "status", label: "Status", type: "text" },
      { name: "driverName", label: "Driver", type: "text" },
      { name: "driverContact", label: "Driver contact", type: "text" },
      { name: "stops", label: "Stops", type: "stops" },
    ],
  },
  {
    key: "events",
    label: "Events",
    description: "Upcoming campus events and celebrations",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "date", label: "Date (YYYY-MM-DD)", type: "text" },
      { name: "startTime", label: "Start time", type: "text" },
      { name: "endTime", label: "End time", type: "text" },
      { name: "venue", label: "Venue", type: "text" },
      { name: "organizer", label: "Organizer", type: "text" },
      { name: "department", label: "Department", type: "text" },
      { name: "category", label: "Category", type: "text" },
    ],
  },
];