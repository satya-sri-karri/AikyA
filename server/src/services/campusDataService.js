const Department = require("../models/Department");
const Faculty = require("../models/Faculty");
const PointOfInterest = require("../models/PointOfInterest");
const BusRoute = require("../models/BusRoute");
const Event = require("../models/Event");

const COLLECTION_LOADERS = {
  departments: () => Department.find().lean(),
  faculty: () => Faculty.find().lean(),
  pois: () => PointOfInterest.find().lean(),
  buses: () => BusRoute.find().lean(),
  events: () => Event.find().lean(),
};

const ALL_COLLECTIONS = Object.keys(COLLECTION_LOADERS);

// Keyword groups map a user question to the MongoDB collections that hold the
// relevant data. Keeping the prompt focused instead of dumping every record
// lets Grok answer from the right campus data while staying within token
// limits as the dataset grows.
const INTENT_KEYWORDS = [
  {
    intent: "departments",
    keywords: ["department", "dept", "cse", "aiml", "ece", "block", "lab", "hod"],
  },
  {
    intent: "faculty",
    keywords: ["faculty", "teacher", "professor", "prof", "teach", "mentor", "lecturer", "staff"],
  },
  {
    intent: "food",
    keywords: ["food", "eat", "canteen", "snack", "restaurant", "shop", "lunch", "breakfast", "dinner", "dosa", "idly", "idli", "tea", "coffee", "maggi", "menu", "price", "hungry"],
  },
  {
    intent: "hostel",
    keywords: ["hostel", "room", "warden", "dorm", "accommodation", "stay", "vacant", "vacancy"],
  },
  {
    intent: "library",
    keywords: ["library", "book", "reading", "reference"],
  },
  {
    intent: "office",
    keywords: ["office", "account", "fee", "medical", "doctor", "nurse", "first aid", "health", "sick", "admission"],
  },
  {
    intent: "access",
    keywords: ["access", "allowed", "restrict", "entry", "enter", "permission", "policy", "can i go", "can i visit", "boys only", "girls only"],
  },
  {
    intent: "events",
    keywords: ["event", "hackathon", "fest", "cultural", "happening", "upcoming", "workshop", "seminar", "celebrat", "technical"],
  },
  {
    intent: "transport",
    keywords: ["bus", "route", "transport", "stop", "commute", "driver", "vehicle"],
  },
  {
    intent: "places",
    keywords: ["where", "location", "located", "near", "find", "address", "directions"],
  },
];

// Which collections to load for each detected intent.
const INTENT_COLLECTIONS = {
  departments: ["departments", "pois"],
  faculty: ["faculty", "departments"],
  food: ["pois"],
  hostel: ["pois"],
  library: ["pois"],
  office: ["pois"],
  access: ["pois"],
  events: ["events"],
  transport: ["buses"],
  places: ["departments", "pois"],
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keywordMatches(question, keyword) {
  const lower = keyword.toLowerCase();
  const safe = escapeRegex(lower);
  if (lower.length <= 3) {
    return new RegExp(`\\b${safe}\\b`, "i").test(question);
  }
  if (lower.length <= 6) {
    return new RegExp(`\\b${safe}`, "i").test(question);
  }
  return question.toLowerCase().includes(lower);
}

function detectIntents(question) {
  const intents = new Set();
  for (const group of INTENT_KEYWORDS) {
    if (group.keywords.some((keyword) => keywordMatches(question, keyword))) {
      intents.add(group.intent);
    }
  }
  return [...intents];
}

function formatDepartments(departments) {
  return departments.map((d) => {
    return `- ${d.name} (${d.code}): ${d.block}, ${d.floor}. HOD: ${d.hod || "N/A"}. Labs: ${(d.labs || []).join(", ") || "none"}. Office hours: ${d.officeHours || "N/A"}. Contact: ${d.contactEmail || "N/A"}`;
  });
}

function formatFaculty(faculty) {
  return faculty.map((f) => {
    return `- ${f.name}, ${f.designation || ""}, ${f.departmentName || ""}. Cabin ${f.cabin || "N/A"} (${f.block || ""}, ${f.floor || ""}). Subjects: ${(f.subjects || []).join(", ")}. On leave: ${f.onLeave}. Available: ${(f.availableSlots || []).join(", ") || "not specified"}. Email: ${f.email || "N/A"}`;
  });
}

function formatPoi(p) {
  let extra = "";
  if (p.type === "shop" && p.items?.length) {
    extra = " Items: " + p.items.map((i) => `${i.name} (Rs.${i.price}${i.available ? "" : ", unavailable"})`).join(", ");
  }
  if (p.type === "hostel") {
    extra = ` Type: ${p.hostelType}. Warden: ${p.warden || "N/A"}. Vacant rooms: ${p.vacantRooms ?? "N/A"}/${p.totalRooms ?? "N/A"}.`;
  }
  let policy = "";
  if (p.accessPolicy) {
    const parts = [
      p.accessPolicy.allowedRoles?.length ? `allowed for ${p.accessPolicy.allowedRoles.join(", ")}` : "",
      p.accessPolicy.restrictedRoles?.length ? `restricted for ${p.accessPolicy.restrictedRoles.join(", ")}` : "",
      p.accessPolicy.startTime && p.accessPolicy.endTime ? `${p.accessPolicy.startTime}-${p.accessPolicy.endTime}` : "",
      p.accessPolicy.note ? p.accessPolicy.note : "",
    ].filter(Boolean);
    if (parts.length) policy = ` Access policy: ${parts.join("; ")}.`;
  }
  return `- [${p.type}] ${p.name}, ${p.block || ""} ${p.floor || ""}. Open: ${p.openHours || "N/A"} (currently ${p.isOpenNow ? "open" : "closed"}).${extra}${policy}`;
}

function formatBuses(buses) {
  return buses.map((b) => {
    return `- Bus ${b.routeNumber}: ${b.routeDescription}. Departs ${b.departureTime || "N/A"}, returns ${b.returnTime || "N/A"}. Status: ${b.status || "N/A"}. Stops: ${(b.stops || []).map((s) => `${s.name} (${s.time})`).join(", ") || "none"}`;
  });
}

function formatEvents(events) {
  return events.map((e) => {
    return `- ${e.title} on ${e.date}, ${e.startTime || "N/A"}-${e.endTime || "N/A"} at ${e.venue || "N/A"}, organized by ${e.organizer || "N/A"}`;
  });
}

function formatCampusData(fetched) {
  const lines = [];

  if (fetched.departments?.length) {
    lines.push("## Departments");
    lines.push(...formatDepartments(fetched.departments));
  }

  if (fetched.faculty?.length) {
    lines.push("\n## Faculty");
    lines.push(...formatFaculty(fetched.faculty));
  }

  if (fetched.pois?.length) {
    lines.push("\n## Points of interest (shops, hostels, blocks, library, offices, grounds)");
    lines.push(...fetched.pois.map(formatPoi));
  }

  if (fetched.buses?.length) {
    lines.push("\n## Bus routes");
    lines.push(...formatBuses(fetched.buses));
  }

  if (fetched.events?.length) {
    lines.push("\n## Events");
    lines.push(...formatEvents(fetched.events));
  }

  return lines.join("\n");
}

// Intent / query understanding -> MongoDB retrieval -> relevant context.
async function retrieveCampusContext(question) {
  const intents = detectIntents(question);

  const needed = new Set();
  for (const intent of intents) {
    for (const collection of INTENT_COLLECTIONS[intent] || []) {
      needed.add(collection);
    }
  }
  if (needed.size === 0) {
    // No intent matched - fall back to a complete campus snapshot so the
    // assistant can still answer general questions about the campus.
    for (const collection of ALL_COLLECTIONS) needed.add(collection);
  }

  const fetched = {};
  await Promise.all(
    [...needed].map(async (name) => {
      fetched[name] = await COLLECTION_LOADERS[name]();
    })
  );

  return { intents, context: formatCampusData(fetched) };
}

module.exports = { retrieveCampusContext, detectIntents };