import { useState, useRef, useCallback, useEffect } from "react";
import campusMapImg from "../assets/aditya_campus_map.png";
import { useUniverse } from "../lib/useUniverse.js";

/* ─────────────────────────────────────────────────────────────────
   HOTSPOTS  (x/y/w/h as % of image natural size 706 × 488)
   Derived from the actual positions visible in the campus map image.
───────────────────────────────────────────────────────────────── */
const HOTSPOTS = [
  // ── TOP ROW: Academic blocks ──
  { id:"ratan-tata",   name:"Ratan Tata Bhavan",                                       cat:"academic", icon:"🛢️", x:2,   y:11,  w:9,  h:14,
    desc:"Aditya University academic building currently housing the first-year students of all departments.",
    details:{ Institution:"Aditya University", Branches:"First-year of all departments", Years:"1st Year", Allocation:"Proposed" } },
  { id:"kl-rao-b",     name:"K.L. Rao Bhavan",                                          cat:"academic", icon:"🏗️", x:14,  y:11,  w:9,  h:14,
    desc:"Named after the distinguished engineer K.L. Rao, this block houses B.Tech Civil Engineering along with M.Tech Structural Engineering and M.Sc Real Estate Valuation.",
    details:{ Institution:"Aditya University", Branches:"Civil · M.Tech Structural · M.Sc Real Estate", Years:"B.Tech 1st-4th · PG 1st-2nd", Allocation:"Proposed" } },
  { id:"bill-gates",   name:"Bill Gates Bhavan",                                       cat:"academic", icon:"💻", x:26,  y:11,  w:9,  h:14,
    desc:"State-of-the-art computing facilities named after tech visionary Bill Gates. Currently hosting the B.Tech Computer Science & Engineering department.",
    details:{ Institution:"Aditya University", Branches:"B.Tech CSE", Years:"B.Tech 1st-4th", Allocation:"Proposed" } },
  { id:"viswesvaraya", name:"Visvesvaraya Bhavan",                                     cat:"academic", icon:"⚙️", x:38,  y:11,  w:11, h:14,
    desc:"ACET administrative building housing B.Tech Electronics & Communication Engineering, plus college administration, examination cell, admissions and transport office.",
    details:{ Institution:"ACET", Branches:"B.Tech ECE + Administration", Years:"B.Tech 1st-4th", Allocation:"Verified dept. building" } },
  { id:"cv-raman",     name:"C.V. Raman Bhavan",                                       cat:"academic", icon:"🔬", x:51,  y:11,  w:11, h:14,
    desc:"ACET department building named after Nobel Laureate C.V. Raman, housing B.Tech Electrical & Electronics, Mechanical and Civil Engineering.",
    details:{ Institution:"ACET", Branches:"B.Tech EEE · Mechanical · Civil", Years:"B.Tech 1st-4th", Allocation:"Verified dept. building" } },
  { id:"ramanujan-b",  name:"Ramanujan Bhavan",                                        cat:"academic", icon:"🔢", x:64,  y:11,  w:10, h:14,
    desc:"ACET academic building named after the mathematician Srinivasa Ramanujan, hosting the B.Tech Computer Science & Engineering department.",
    details:{ Institution:"ACET", Branches:"B.Tech CSE", Years:"B.Tech 1st-4th", Allocation:"Verified" } },
  { id:"james-watt",   name:"James Watt Bhavan",                                       cat:"academic", icon:"🤖", x:77,  y:11,  w:10, h:14,
    desc:"ACET academic building for B.Tech Artificial Intelligence & Machine Learning, B.Tech Data Science and IoT-related programs, with AI, ML and data science labs.",
    details:{ Institution:"ACET", Branches:"AI & ML · Data Science · IoT", Years:"B.Tech 1st-4th", Allocation:"Verified grouping" } },
  { id:"newton",       name:"Newton Bhavan",                                           cat:"academic", icon:"🍎", x:89,  y:11,  w:11, h:14,
    desc:"ACET academic building named after Sir Isaac Newton, hosting the B.Tech Information Technology department with web, cloud and data structures labs.",
    details:{ Institution:"ACET", Branches:"B.Tech IT", Years:"B.Tech 1st-4th", Allocation:"Verified" } },

  // ── MIDDLE ROW: More academic bhavans ──
  { id:"cotton-b",     name:"Cotton Bhavan",                                           cat:"academic", icon:"🌾", x:14,  y:47,  w:10, h:13,
    desc:"Aditya University academic building planned for B.Tech Agricultural Engineering and B.Tech Mining Engineering.",
    details:{ Institution:"Aditya University", Branches:"Agri Engg · Mining Engg", Years:"B.Tech 1st-4th", Allocation:"Proposed" } },
  { id:"bhaskara-b",   name:"Bhaskara Bhavan",                                         cat:"academic", icon:"🔬", x:2,   y:60,  w:11, h:13,
    desc:"Aditya University academic building currently housing the AIML department for 2nd to 4th year students.",
    details:{ Institution:"Aditya University", Branches:"B.Tech AI & ML", Years:"2nd-4th Year", Allocation:"Proposed" } },

  // ── GROUNDS ──
  { id:"kl-rao-ground",    name:"KL Rao Ground",       cat:"ground",   icon:"⚽", x:12,  y:33,  w:14, h:16,
    desc:"Main sports ground used for cricket, football, and university athletics meets. Fully floodlit for evening events.",
    details:{ Area:"4 acres", Sports:"Cricket · Football · Athletics", Lighting:"Floodlit", Capacity:"5 000 spectators" } },
  { id:"ramanujan-ground", name:"Ramanujan Ground",    cat:"ground",   icon:"🏃", x:63,  y:18,  w:11, h:12,
    desc:"Athletics training and field sports facility used for inter-college tournaments.",
    details:{ Area:"2.5 acres", Sports:"Athletics · Field events", Type:"Outdoor" } },
  { id:"cv-raman-ground",  name:"CV Raman Ground",     cat:"ground",   icon:"🏏", x:54,  y:30,  w:13, h:16,
    desc:"Cricket and outdoor sports ground featuring natural turf and a practice net zone.",
    details:{ Area:"3 acres", Sports:"Cricket · Basketball", Lighting:"Floodlit" } },
  { id:"bus-ground",       name:"Bus Ground",           cat:"facility", icon:"🚌", x:54,  y:56,  w:18, h:18,
    desc:"Transportation hub with over 100 university buses covering routes across Kakinada, Surampalem, Rajahmundry and beyond.",
    details:{ Fleet:"100+ buses", Routes:"Regional & City", Timings:"5:30 AM – 9:30 PM", Tracking:"GPS enabled" } },
  { id:"bpd-ground",       name:"BPD Ground",           cat:"ground",   icon:"🏟️", x:54,  y:75,  w:18, h:14,
    desc:"Multi-purpose sports ground for large-scale athletic and recreational activities, also used for university fests.",
    details:{ Area:"5 acres", Type:"Multi-purpose", Events:"Sports & Recreation", Capacity:"8 000" } },

  // ── HOSTELS ──
  { id:"boys-hostels",  name:"Boys Hostels",  cat:"hostel", icon:"🏠", x:70,  y:30,  w:13, h:18,
    desc:"Modern residential campus for male students featuring Wi-Fi, air-cooled mess, gymnasium, and 24/7 CCTV security.",
    details:{ Capacity:"3 000+ residents", Blocks:"6 blocks", Amenities:"Wi-Fi · Mess · Gym · Laundry", Security:"24 / 7 CCTV" } },
  { id:"girls-hostels", name:"Girls Hostels", cat:"hostel", icon:"🏡", x:2,   y:65,  w:11, h:13,
    desc:"Secure residential facility for female students with dedicated wardens, biometric access, and modern amenities.",
    details:{ Capacity:"2 000+ residents", Blocks:"4 blocks", Amenities:"Wi-Fi · Mess · Gym · Beauty salon", Security:"Biometric + 24/7 CCTV" } },

  // ── FACILITIES ──
  { id:"open-air-audi", name:"Open Air Auditorium",            cat:"facility", icon:"🎭", x:13,  y:30,  w:7,  h:5,
    desc:"Open-air venue for university convocations, cultural performances, and large campus gatherings.",
    details:{ Capacity:"3 000 seats", Type:"Open Air", Events:"Convocation · Culturals · Guest lectures" } },
  { id:"fete",          name:"Fete Area",                      cat:"facility", icon:"🎪", x:34,  y:33,  w:6,  h:16,
    desc:"Dedicated event zone hosting annual fetes, cultural fairs, and student-led exhibitions.",
    details:{ Type:"Event & Exhibition Space", Events:"Annual Fete · Cultural Shows · Exhibitions" } },
  { id:"hango-garden",  name:"Hango Garden",                   cat:"facility", icon:"🌸", x:42,  y:33,  w:9,  h:13,
    desc:"Beautifully maintained garden at the heart of campus, a popular spot for relaxation and informal gatherings.",
    details:{ Type:"Landscaped Garden", Timings:"Always open" } },
  { id:"temples",       name:"Temples",                        cat:"facility", icon:"⛩️", x:42,  y:46,  w:9,  h:8,
    desc:"Campus spiritual center with temples for multiple faiths, open to all students and staff.",
    details:{ Timings:"6 AM – 8 PM", Type:"Spiritual Centre", Faiths:"Multi-faith" } },
  { id:"water-pond",    name:"Water Pond",                     cat:"facility", icon:"💧", x:29,  y:47,  w:8,  h:9,
    desc:"Scenic water pond at the campus center, near the main roundabout.",
    details:{ Type:"Ornamental Pond", Location:"Central Campus" } },
  { id:"parking",       name:"Parking Area",                   cat:"facility", icon:"🅿️", x:2,   y:33,  w:10, h:10,
    desc:"Dedicated multi-vehicle parking with separate zones for staff, students, and visitors.",
    details:{ Capacity:"500+ vehicles", Type:"Open + Covered", Charges:"Free for staff · ₹20/hr visitors" } },
  { id:"guest-house",   name:"Guest House",                    cat:"facility", icon:"🏨", x:89,  y:32,  w:11, h:14,
    desc:"Premium accommodation for visiting faculty, corporate guests, and parents visiting the campus.",
    details:{ Rooms:"50 AC rooms", Amenities:"Wi-Fi · Restaurant · Conference room", Rating:"Premium" } },

  // ── ADMIN ──
  { id:"incubator",    name:"Aditya Global Business Incubator", cat:"admin", icon:"🚀", x:2,   y:47,  w:12, h:13,
    desc:"Award-winning startup incubation center supporting student and faculty entrepreneurial ventures with seed funding and mentorship.",
    details:{ "Active startups":"50+", Mentors:"100+ industry mentors", Funding:"Seed grants available", Recognition:"Govt. recognised" } },

  // ── SOUTH CAMPUS ──
  { id:"pharmacy-college",    name:"Aditya Pharmacy College",        cat:"academic", icon:"💊", x:15,  y:65,  w:12, h:12,
    desc:"Pharmacy academic zone of Aditya University for B.Pharm and Pharm.D with chemistry, pharmacognosy and pharmacology labs.",
    details:{ Institution:"Aditya University · Pharmacy zone", Programs:"B.Pharm · Pharm.D", Years:"B.Pharm 1st-4th · Pharm.D 1st-6th", Allocation:"Program verified; building proposed" } },
  { id:"kalam-bhavan",         name:"Abdul Kalam Bhavan",             cat:"academic", icon:"🛸", x:29,  y:65,  w:12, h:12,
    desc:"Aditya Polytechnic College building for polytechnic administration, examination cell and common first-year diploma classes.",
    details:{ Institution:"Aditya Polytechnic College", Function:"Admin · Exam Cell · Common 1st-yr Classes", Years:"Diploma 1st Year", Allocation:"Verified" } },
  { id:"college-of-pharmacy",  name:"Aditya College of Pharmacy",     cat:"academic", icon:"🧪", x:14,  y:78,  w:13, h:12,
    desc:"Postgraduate pharmacy college of Aditya University for M.Pharm Pharmaceutics and M.Pharm Pharmaceutical Analysis, with advanced pharmacy labs and research.",
    details:{ Institution:"Aditya University · Pharmacy zone", Programs:"M.Pharm Pharmaceutics · Pharma Analysis", Years:"M.Pharm 1st-2nd · research", Allocation:"Program verified; building proposed" } },
  { id:"degree-pg",            name:"Aditya Degree & PG College",     cat:"academic", icon:"🎓", x:29,  y:78,  w:13, h:12,
    desc:"Aditya Degree College, Surampalem hosting BBA, B.Sc Forensic Science, B.Sc Animation, B.Sc AI & Robotics, B.Sc Data Science, B.Sc Cyber Forensics and MCA/MBA.",
    details:{ Programmes:"BBA · B.Sc (Forensic/Animation/AI-Robotics/Data Sci/Cyber Forensics)", College:"Aditya Degree College, Surampalem", Years:"Degree 1st-3rd", Allocation:"Programs verified; rooms dynamic" } },
  { id:"einstein-b",           name:"Einstein Bhavan",                cat:"academic", icon:"🔧", x:44,  y:90,  w:13, h:10,
    desc:"Aditya Polytechnic College department building for Diploma Civil, Electrical/EEE, Computer Engineering/CSE and Communication & Computer Networking.",
    details:{ Institution:"Aditya Polytechnic College", Programs:"Diploma Civil · EEE · CSE · CCN", Years:"Diploma 2nd-3rd Year", Allocation:"Verified departments" } },
  { id:"edison-b",             name:"Edison Bhavan",                  cat:"academic", icon:"⚙️", x:59,  y:90,  w:13, h:10,
    desc:"Aditya Polytechnic College department building for Diploma Mechanical Engineering and Diploma ECE.",
    details:{ Institution:"Aditya Polytechnic College", Programs:"Diploma ME · ECE", Years:"Diploma 2nd-3rd Year", Allocation:"Verified" } },
  { id:"polytechnic",          name:"Aditya Polytechnic College (Shared)", cat:"academic", icon:"🔩", x:10,  y:90,  w:15, h:10,
    desc:"Shared polytechnic facilities, laboratories, workshops and overflow classes for the diploma programs.",
    details:{ Institution:"Aditya Polytechnic College", Function:"Shared labs · Workshops · Overflow classes", Years:"Diploma 1st-3rd", Allocation:"Proposed as shared facility" } },
];

const CAT_META = {
  academic: { label:"Academic",  color:"#4338ca", glow:"rgba(99,102,241,0.6)"  },
  hostel:   { label:"Hostel",    color:"#059669", glow:"rgba(16,185,129,0.6)"  },
  ground:   { label:"Ground",    color:"#d97706", glow:"rgba(245,158,11,0.6)"  },
  facility: { label:"Facility",  color:"#7c3aed", glow:"rgba(139,92,246,0.6)"  },
  admin:    { label:"Admin",     color:"#db2777", glow:"rgba(236,72,153,0.6)"  },
};

const DETAIL_ICONS = {
  Floors:"🏢", Department:"📚", Capacity:"👥", Established:"📅", Area:"📐",
  Sports:"⚽", Lighting:"💡", Type:"🏷️", Security:"🔒", Amenities:"✨",
  Programs:"📖", Rooms:"🛏️", "Active startups":"💡", Mentors:"👨‍🏫",
  Funding:"💰", Recognition:"🏅", Fleet:"🚌", Routes:"🗺️", Timings:"⏰",
  Tracking:"📡", Events:"🎉", Booking:"📞", Rating:"⭐", Faiths:"🛐",
  Blocks:"🏗️", Affiliation:"🎓", Accreditation:"✅", Labs:"🔬",
  Intake:"📊", Duration:"⏱️", Charges:"💳", NAAC:"🏅",
  "UG Programs":"📖", "PG Programs":"📖", Year:"📅", Location:"📍",
  Institution:"🏛️", Branches:"🎓", Years:"🗓️", Allocation:"📋",
  Function:"🛠️", Programmes:"📖", College:"🏫",
};

const FILTERS = [
  { key:"all",      label:"All",        icon:"🗺️" },
  { key:"academic", label:"Academic",   icon:"🏛️" },
  { key:"hostel",   label:"Hostels",    icon:"🏠" },
  { key:"ground",   label:"Grounds",    icon:"⚽" },
  { key:"facility", label:"Facilities", icon:"🔧" },
  { key:"admin",    label:"Admin",      icon:"🚀" },
];

function normalize(name = "") {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

// Enrich a hotspot with live allocation data from the matching DB POI
// (editable by admins). Geometry (x/y/w/h) stays static; allocation text
// comes from the database so yearly changes don't need code edits.
function resolveHotspotDetails(hotspot, pois) {
  const key = normalize(hotspot.name);
  const poi = pois.find((p) => {
    if (!p || typeof p.name !== "string") return false;
    const pn = normalize(p.name);
    const pb = normalize(p.block);
    return pn === key || (pb && pb === key);
  });
  if (!poi) return hotspot;
  const alloc = poi.allocation || {};
  let details = null;
  if (alloc && (alloc.branches?.length || alloc.institution || alloc.years || alloc.status)) {
    details = {};
    if (alloc.institution) details.Institution = alloc.institution;
    if (alloc.branches?.length) details.Branches = alloc.branches.join(" · ");
    if (alloc.years) details.Years = alloc.years;
    if (alloc.status) details.Allocation = alloc.status;
  }
  // Prefer the admin-editable description from the DB over the static blurb.
  const cleanDesc = typeof poi.description === "string"
    ? poi.description.replace(/\s*Allocation:\s*[^.]*\.?\s*$/i, "").trim()
    : hotspot.desc;
  return {
    ...hotspot,
    poi,
    desc: cleanDesc || hotspot.desc,
    details: details || hotspot.details,
  };
}

/* ──────────────────────────────────────────────────────────────── */
export default function AdityaUniversityMap() {
  const { data: universe } = useUniverse(["pois"]);
  const pois = universe.pois || [];

  const [cat, setCat]           = useState("all");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Pan + Zoom state
  const [zoom, setZoom]   = useState(1);
  const [pan, setPan]     = useState({ x: 0, y: 0 });
  const dragging          = useRef(false);
  const lastPos           = useRef({ x: 0, y: 0 });
  const containerRef      = useRef(null);

  // ── open / close detail panel ──
  const openBuilding = useCallback((b) => {
    setSelected(b);
    setPanelOpen(true);
  }, []);
  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setTimeout(() => setSelected(null), 350);
  }, []);

  // ── zoom helpers ──
  const adjustZoom = useCallback((delta) => {
    setZoom(z => Math.min(3, Math.max(0.4, z * delta)));
  }, []);
  const resetView = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  // ── mouse drag pan ──
  const onMouseDown = useCallback((e) => {
    if (e.target.closest("[data-hotspot]")) return; // let hotspot clicks through
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, []);
  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  }, []);
  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  // ── wheel zoom ──
  const onWheel = useCallback((e) => {
    e.preventDefault();
    adjustZoom(e.deltaY < 0 ? 1.12 : 0.9);
  }, [adjustZoom]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  // ── filter logic ──
  const isVisible = useCallback((h) => {
    const q = search.toLowerCase().trim();
    const catOk = cat === "all" || h.cat === cat;
    const searchOk = !q || h.name.toLowerCase().includes(q) || (h.alias || "").toLowerCase().includes(q) || h.cat.toLowerCase().includes(q);
    return catOk && searchOk;
  }, [cat, search]);

  // Live hotspots: static geometry + DB-supplied allocation (editable by admin).
  const liveHotspots = pois.length ? HOTSPOTS.map((h) => resolveHotspotDetails(h, pois)) : HOTSPOTS;

  const counts = { all: liveHotspots.length };
  Object.keys(CAT_META).forEach(k => { counts[k] = liveHotspots.filter(h => h.cat === k).length; });

  return (
    <div style={S.wrapper}>
      {/* ── Toolbar ── */}
      <div style={S.toolbar}>
        {/* Search */}
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>🔍</span>
          <input
            style={S.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search buildings, grounds, facilities…"
            aria-label="Search campus map"
          />
          {search && (
            <button style={S.clearBtn} onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        {/* Category filters */}
        <div style={S.filterRow}>
          {FILTERS.map(f => {
            const meta = CAT_META[f.key];
            const active = cat === f.key;
            return (
              <button
                key={f.key}
                style={{
                  ...S.filterBtn,
                  background:  active ? (meta?.color ?? "#f59e0b") : "transparent",
                  borderColor: active ? (meta?.color ?? "#f59e0b") : "rgba(255,255,255,0.12)",
                  color:       active ? "#fff" : "#94a3b8",
                  boxShadow:   active ? `0 2px 12px ${meta?.glow ?? "rgba(245,158,11,0.4)"}` : "none",
                  transform:   active ? "translateY(-1px)" : "none",
                }}
                onClick={() => setCat(f.key)}
              >
                {f.icon} {f.label}
                <span style={S.countBadge}>{counts[f.key]}</span>
              </button>
            );
          })}
        </div>

        {/* Zoom controls (right side) */}
        <div style={{ marginLeft:"auto", display:"flex", gap:4, alignItems:"center" }}>
          <button style={S.ctrlBtn} onClick={() => adjustZoom(1.2)} title="Zoom in">＋</button>
          <button style={S.ctrlBtn} onClick={() => adjustZoom(0.83)} title="Zoom out">－</button>
          <button style={S.ctrlBtn} onClick={resetView} title="Reset view" aria-label="Reset view">⟳</button>
          <span style={{ fontSize:11, color:"#475569", minWidth:36 }}>{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* ── Map Container (pannable / zoomable) ── */}
      <div
        ref={containerRef}
        style={S.mapScroll}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          style={{
            transformOrigin: "top left",
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: dragging.current ? "none" : "transform 0.18s ease",
            position: "relative",
            display: "inline-block",
            cursor: dragging.current ? "grabbing" : "grab",
            userSelect: "none",
          }}
        >
          {/* ── The actual campus map image ── */}
          <img
            src={campusMapImg}
            alt="Aditya University Campus Map"
            style={{ display:"block", maxWidth:"100%", borderRadius:16, boxShadow:"0 20px 60px rgba(0,0,0,0.7)", pointerEvents:"none" }}
            draggable={false}
          />

          {/* ── Invisible hotspot overlays ── */}
          {liveHotspots.map(h => {
            const visible = isVisible(h);
            const isSel = selected?.id === h.id;
            const meta = CAT_META[h.cat];
            return (
              <button
                key={h.id}
                data-hotspot="1"
                onClick={() => visible && openBuilding(h)}
                title={h.name}
                style={{
                  position: "absolute",
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  width: `${h.w}%`,
                  height: `${h.h}%`,
                  borderRadius: 6,
                  border: isSel
                    ? `2px solid #f59e0b`
                    : visible
                      ? `1.5px solid ${meta.color}88`
                      : "1.5px solid transparent",
                  background: isSel
                    ? `${meta.color}44`
                    : visible
                      ? `${meta.color}18`
                      : "transparent",
                  boxShadow: isSel ? `0 0 18px ${meta.glow}, inset 0 0 12px ${meta.color}33` : "none",
                  cursor: visible ? "pointer" : "default",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  padding: "3px 4px",
                  opacity: visible ? 1 : 0.15,
                  transition: "all 0.2s",
                  outline: "none",
                  zIndex: isSel ? 20 : 10,
                }}
                onMouseEnter={e => {
                  if (!visible || isSel) return;
                  e.currentTarget.style.background = `${meta.color}30`;
                  e.currentTarget.style.border = `1.5px solid ${meta.color}cc`;
                }}
                onMouseLeave={e => {
                  if (!visible || isSel) return;
                  e.currentTarget.style.background = `${meta.color}18`;
                  e.currentTarget.style.border = `1.5px solid ${meta.color}88`;
                }}
              >
                {/* Tiny label shown on hover / selected */}
                {isSel && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: "#fff",
                    background: meta.color, borderRadius: 4,
                    padding: "1px 4px", lineHeight: 1.4,
                    pointerEvents: "none", whiteSpace: "nowrap",
                    maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis",
                    boxShadow: `0 1px 6px rgba(0,0,0,0.5)`,
                  }}>
                    {h.icon} {h.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Legend (bottom of scroll area) ── */}
      <div style={S.legendBar}>
        {Object.entries(CAT_META).map(([k, m]) => (
          <div key={k} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#94a3b8" }}>
            <span style={{ width:10, height:10, borderRadius:3, background:m.color, display:"inline-block", flexShrink:0 }} />
            {m.label}
          </div>
        ))}
        <span style={{ marginLeft:"auto", fontSize:11, color:"#475569" }}>
          💡 Click a building · Scroll to zoom · Drag to pan
        </span>
      </div>

      {/* ── Info Panel (slide-in from right) ── */}
      <div style={{ ...S.infoPanel, right: panelOpen ? 0 : -410 }}>
        {selected && (
          <PanelContent b={selected} meta={CAT_META[selected.cat]} onClose={closePanel} />
        )}
      </div>

      <style>{`
        .aditya-map-scroll::-webkit-scrollbar { width:6px; height:6px; }
        .aditya-map-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .aditya-map-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius:4px; }
        .aditya-map-scroll::-webkit-scrollbar-thumb:hover { background: rgba(245,158,11,0.35); }
      `}</style>
    </div>
  );
}

/* ── Building Detail Panel ──────────────────────────────────────── */
function PanelContent({ b, meta, onClose }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", color:"#e2e8f0", fontFamily:"'Inter',sans-serif" }}>
      {/* Header */}
      <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)", position:"relative", flexShrink:0 }}>
        <button onClick={onClose} style={S.panelClose} aria-label="Close">✕</button>
        <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, background:`${meta.color}22`, color:meta.color, border:`1px solid ${meta.color}44`, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10 }}>
          {b.icon} {meta.label}
        </div>
        <div style={{ fontSize:20, fontWeight:800, color:"#f1f5f9", lineHeight:1.25, marginBottom:6, paddingRight:36 }}>{b.name}</div>
        {b.alias && <div style={{ fontSize:12, color:"#475569", marginBottom:6 }}>Also known as: {b.alias}</div>}
        <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.65 }}>{b.desc}</div>
      </div>

      {/* Details */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px 20px" }}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"#475569", marginBottom:10 }}>Details</div>
        {Object.entries(b.details || {}).map(([k, v]) => (
          <div key={k} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 12px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, marginBottom:8, fontSize:12 }}>
            <span style={{ fontSize:15, width:20, textAlign:"center", flexShrink:0 }}>{DETAIL_ICONS[k] || "📌"}</span>
            <div>
              <div style={{ fontWeight:600, color:"#cbd5e1", marginBottom:2, textTransform:"capitalize" }}>{k}</div>
              <div style={{ color:"#64748b" }}>{v}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */
const S = {
  wrapper: {
    display:"flex", flexDirection:"column",
    height:"min(82vh, 800px)",
    background:"#060b15",
    borderRadius:16,
    overflow:"hidden",
    border:"1px solid rgba(255,255,255,0.07)",
    boxShadow:"0 20px 60px rgba(0,0,0,0.5)",
    position:"relative",
    fontFamily:"'Inter', sans-serif",
  },
  toolbar: {
    flexShrink:0,
    padding:"10px 14px",
    background:"linear-gradient(135deg,#0a1020,#10143a)",
    borderBottom:"1px solid rgba(255,255,255,0.07)",
    display:"flex", gap:10, flexWrap:"wrap", alignItems:"center",
    zIndex:20,
  },
  searchWrap: {
    position:"relative", flex:"1 1 200px", maxWidth:340,
  },
  searchIcon: {
    position:"absolute", left:11, top:"50%", transform:"translateY(-50%)",
    fontSize:13, pointerEvents:"none", color:"#475569",
  },
  searchInput: {
    width:"100%", padding:"8px 34px 8px 34px",
    background:"rgba(255,255,255,0.05)",
    border:"1px solid rgba(255,255,255,0.1)",
    borderRadius:12, color:"#e2e8f0",
    fontFamily:"inherit", fontSize:13, outline:"none",
    boxSizing:"border-box",
  },
  clearBtn: {
    position:"absolute", right:9, top:"50%", transform:"translateY(-50%)",
    background:"none", border:"none", color:"#475569",
    cursor:"pointer", fontSize:11, padding:2, lineHeight:1,
  },
  filterRow: {
    display:"flex", gap:5, flexWrap:"wrap", alignItems:"center",
  },
  filterBtn: {
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"5px 11px", borderRadius:20,
    border:"1px solid rgba(255,255,255,0.12)",
    background:"transparent", color:"#94a3b8",
    fontFamily:"inherit", fontSize:11, fontWeight:600,
    cursor:"pointer", transition:"all 0.22s", letterSpacing:"0.3px",
  },
  countBadge: {
    background:"rgba(255,255,255,0.15)", borderRadius:10,
    padding:"0 5px", fontSize:10, fontWeight:700, marginLeft:2,
  },
  ctrlBtn: {
    width:28, height:28,
    background:"rgba(255,255,255,0.06)",
    backdropFilter:"blur(8px)",
    border:"1px solid rgba(255,255,255,0.12)",
    borderRadius:8, color:"#e2e8f0",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:15, cursor:"pointer", lineHeight:1,
  },
  mapScroll: {
    flex:1, overflow:"auto",
    padding:20,
    background:"#060b15",
    display:"flex",
    alignItems:"flex-start",
    justifyContent:"center",
  },
  legendBar: {
    flexShrink:0,
    padding:"8px 16px",
    borderTop:"1px solid rgba(255,255,255,0.06)",
    background:"rgba(0,0,0,0.3)",
    display:"flex", gap:16, alignItems:"center", flexWrap:"wrap",
  },
  infoPanel: {
    position:"absolute", top:0, bottom:0, width:390,
    background:"linear-gradient(160deg, rgba(8,14,26,0.97) 0%, rgba(18,14,52,0.97) 100%)",
    backdropFilter:"blur(24px)",
    borderLeft:"1px solid rgba(255,255,255,0.1)",
    transition:"right 0.4s cubic-bezier(0.4,0,0.2,1)",
    zIndex:300, display:"flex", flexDirection:"column", overflow:"hidden",
  },
  panelClose: {
    position:"absolute", top:16, right:16,
    background:"rgba(255,255,255,0.08)", border:"none",
    color:"#94a3b8", width:30, height:30,
    borderRadius:8, cursor:"pointer", fontSize:14,
    display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1,
  },
};
