import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
//  BUILDING DATA
// ─────────────────────────────────────────────
const BUILDINGS = [
  { id:"ratan-tata", name:"Ratan Tata Bhavan", alias:"Cotton Bhavan", cat:"academic", icon:"🏛️", x:15,   y:15,  w:100, h:65,
    desc:"Premier academic block housing core Engineering & Technology departments. Named after the legendary industrialist Ratan Tata.",
    details:{ Floors:"G + 4", Department:"Engineering & Technology", Capacity:"2 000+ students", Established:"2005" } },
  { id:"kl-rao",      name:"KL Rao Bhavan",        cat:"academic", icon:"🏫", x:130,  y:15,  w:100, h:65,
    desc:"Named after the distinguished engineer K.L. Rao, this block houses Computer Science & IT departments with cutting-edge labs.",
    details:{ Floors:"G + 4", Department:"CSE & Information Technology", Capacity:"1 800+ students", Established:"2006" } },
  { id:"bill-gates",  name:"Bill Gates Bhavan",     cat:"academic", icon:"💻", x:245,  y:15,  w:100, h:65,
    desc:"State-of-the-art computing facilities named after tech visionary Bill Gates. Features high-performance computing labs and innovation hubs.",
    details:{ Floors:"G + 3", Department:"Computer Science & Software Eng.", Capacity:"1 500+ students", Established:"2008" } },
  { id:"viswesvaraya",name:"Viswesvaraya Bhavan",   cat:"academic", icon:"⚙️", x:363,  y:15,  w:110, h:65,
    desc:"Home to Mechanical and Civil Engineering, named after Bharat Ratna Sir M. Visvesvaraya. Equipped with advanced fabrication labs.",
    details:{ Floors:"G + 4", Department:"Mechanical & Civil Engineering", Capacity:"1 600+ students", Established:"2007" } },
  { id:"cv-raman",    name:"C.V. Raman Bhavan",     cat:"academic", icon:"🔬", x:490,  y:15,  w:110, h:65,
    desc:"Science and research hub named after Nobel Laureate C.V. Raman, featuring physics, chemistry and materials research labs.",
    details:{ Floors:"G + 3", Department:"Sciences & Research", Capacity:"1 200+ students", Established:"2009" } },
  { id:"ramanujan",   name:"Ramanujan Bhavan",       cat:"academic", icon:"🔢", x:618,  y:15,  w:110, h:65,
    desc:"Mathematics and Applied Sciences block named after the legendary mathematician Srinivasa Ramanujan.",
    details:{ Floors:"G + 3", Department:"Mathematics & Applied Sciences", Capacity:"1 000+ students", Established:"2010" } },
  { id:"newton",      name:"Newton Bhavan",           cat:"academic", icon:"🍎", x:1062, y:15,  w:122, h:65,
    desc:"Physics and Engineering Research Centre named after Sir Isaac Newton. Houses VLSI labs, robotics centre and a patent cell.",
    details:{ Floors:"G + 4", Department:"Physics & Engineering Research", Capacity:"1 400+ students", Established:"2011" } },

  { id:"kl-rao-ground",    name:"KL Rao Ground",       cat:"ground",   icon:"⚽", x:152, y:214, w:168, h:82,
    desc:"Main sports ground used for cricket, football, and university athletics meets. Fully floodlit for evening events.",
    details:{ Area:"4 acres", Sports:"Cricket · Football · Athletics", Lighting:"Floodlit", Capacity:"5 000 spectators" } },
  { id:"ramanujan-ground",  name:"Ramanujan Ground",    cat:"ground",   icon:"🏃", x:750, y:88,  w:125, h:62,
    desc:"Athletics training and field sports facility used for inter-college tournaments.",
    details:{ Area:"2.5 acres", Sports:"Athletics · Field events", Type:"Outdoor" } },
  { id:"cv-raman-ground",   name:"CV Raman Ground",     cat:"ground",   icon:"🏏", x:552, y:214, w:148, h:80,
    desc:"Cricket and outdoor sports ground featuring natural turf and a practice net zone.",
    details:{ Area:"3 acres", Sports:"Cricket · Basketball", Lighting:"Floodlit" } },
  { id:"bpd-ground",        name:"BPD Ground",           cat:"ground",   icon:"🏟️", x:550, y:540, w:195, h:105,
    desc:"Multi-purpose sports ground for large-scale athletic and recreational activities, also used for university fests.",
    details:{ Area:"5 acres", Type:"Multi-purpose", Events:"Sports & Recreation", Capacity:"8 000" } },

  { id:"boys-hostels",  name:"Boys Hostels",   cat:"hostel", icon:"🏠", x:718, y:214, w:138, h:94,
    desc:"Modern residential campus for male students featuring Wi-Fi, air-cooled mess, gymnasium, and 24/7 CCTV security.",
    details:{ Capacity:"3 000+ residents", Blocks:"6 blocks", Amenities:"Wi-Fi · Mess · Gym · Laundry", Security:"24 / 7 CCTV" } },
  { id:"girls-hostels", name:"Girls Hostels",  cat:"hostel", icon:"🏡", x:10,  y:470, w:130, h:70,
    desc:"Secure residential facility for female students with dedicated wardens, biometric access, and modern amenities.",
    details:{ Capacity:"2 000+ residents", Blocks:"4 blocks", Amenities:"Wi-Fi · Mess · Gym · Beauty salon", Security:"Biometric + 24/7 CCTV" } },

  { id:"open-air-audi", name:"Open Air Auditorium", cat:"facility", icon:"🎭", x:152, y:194, w:72,  h:22,
    desc:"Open-air venue for university convocations, cultural performances, and large campus gatherings.",
    details:{ Capacity:"3 000 seats", Type:"Open Air", Events:"Convocation · Culturals · Guest lectures" } },
  { id:"fete",       name:"Fete Area",   cat:"facility", icon:"🎪", x:368, y:214, w:62,  h:82,
    desc:"Dedicated event zone hosting annual fetes, cultural fairs, and student-led exhibitions.",
    details:{ Type:"Event & Exhibition Space", Events:"Annual Fete · Cultural Shows · Exhibitions" } },
  { id:"temples",    name:"Temples",     cat:"facility", icon:"⛩️", x:440, y:302, w:64,  h:40,
    desc:"Campus spiritual center with temples for multiple faiths, open to all students and staff.",
    details:{ Timings:"6 AM – 8 PM", Type:"Spiritual Centre", Faiths:"Multi-faith" } },
  { id:"guest-house", name:"Guest House", cat:"facility", icon:"🏨", x:1062, y:216, w:122, h:76,
    desc:"Premium accommodation for visiting faculty, corporate guests, and parents visiting the campus.",
    details:{ Rooms:"50 AC rooms", Amenities:"Wi-Fi · Restaurant · Conference room", Rating:"Premium" } },
  { id:"parking",    name:"Parking Area", cat:"facility", icon:"🅿️", x:10,  y:214, w:105, h:55,
    desc:"Dedicated multi-vehicle parking with separate zones for staff, students, and visitors.",
    details:{ Capacity:"500+ vehicles", Type:"Open + Covered", Charges:"Free for staff · ₹20/hr visitors" } },
  { id:"bus-ground", name:"Bus Ground",   cat:"facility", icon:"🚌", x:550, y:414, w:200, h:95,
    desc:"Transportation hub with over 100 university buses covering routes across Kakinada, Surampalem, Rajahmundry and beyond.",
    details:{ Fleet:"100+ buses", Routes:"Regional & City", Timings:"5:30 AM – 9:30 PM", Tracking:"GPS enabled" } },

  { id:"incubator", name:"Aditya Global Business Incubator", cat:"admin", icon:"🚀", x:10, y:358, w:138, h:68,
    desc:"Award-winning startup incubation center supporting student and faculty entrepreneurial ventures with seed funding and mentorship.",
    details:{ "Active startups":"50+", Mentors:"100+ industry mentors", Funding:"Seed grants available", Recognition:"Govt. recognised" } },

  { id:"pharmacy-college",   name:"Aditya Pharmacy College",      cat:"academic", icon:"💊", x:162, y:450, w:125, h:58,
    desc:"Premier PCI-approved pharmacy institution with state-of-the-art pharmaceutical labs and research facilities.",
    details:{ Programs:"B.Pharm · M.Pharm · Pharm.D", Labs:"10+ specialised labs", Accreditation:"PCI Approved", NAAC:"A Grade" } },
  { id:"kalam-bhavan",       name:"Abdul Kalam Bhavan",            cat:"academic", icon:"🛸", x:368, y:450, w:132, h:58,
    desc:"Named after Dr. APJ Abdul Kalam, this block houses Aerospace Engineering, AI & Robotics, and advanced technology research.",
    details:{ Floors:"G + 3", Department:"Aerospace · AI · Robotics", Year:"2015", Labs:"Robotics · AI · Avionics" } },
  { id:"college-of-pharmacy",name:"Aditya College of Pharmacy",    cat:"academic", icon:"🧪", x:135, y:544, w:132, h:58,
    desc:"Undergraduate pharmacy college with a strong focus on clinical pharmacy and pharmaceutical chemistry.",
    details:{ Programs:"B.Pharm", Intake:"100 students/year", Accreditation:"PCI Approved" } },
  { id:"degree-pg",          name:"Aditya Degree & PG College",    cat:"academic", icon:"🎓", x:368, y:544, w:142, h:58,
    desc:"Comprehensive undergraduate and postgraduate institution offering programs across Humanities, Commerce and Sciences.",
    details:{ "UG Programs":"BA · B.Com · B.Sc", "PG Programs":"MA · M.Com · M.Sc", Intake:"500+ students/year", Affiliation:"Adikavi Nannaya University" } },
  { id:"polytechnic",        name:"Aditya Polytechnic College",     cat:"academic", icon:"🔧", x:108, y:640, w:152, h:58,
    desc:"Technical diploma college offering hands-on engineering education in multiple branches.",
    details:{ Programs:"Diploma – ECE · ME · Civil · CSE", Duration:"3 years", Affiliation:"SBTET Andhra Pradesh" } },
];

const CAT_META = {
  academic: { label:"Academic",  color:"#4338ca", glow:"rgba(67,56,202,0.5)",   bg:"linear-gradient(145deg,#1d4ed8,#4338ca)", border:"rgba(99,102,241,0.5)"  },
  hostel:   { label:"Hostel",    color:"#059669", glow:"rgba(5,150,105,0.5)",    bg:"linear-gradient(145deg,#047857,#059669)", border:"rgba(16,185,129,0.45)" },
  ground:   { label:"Ground",    color:"#d97706", glow:"rgba(217,119,6,0.5)",    bg:"linear-gradient(145deg,#b45309,#d97706)", border:"rgba(245,158,11,0.5)"  },
  facility: { label:"Facility",  color:"#7c3aed", glow:"rgba(124,58,237,0.5)",   bg:"linear-gradient(145deg,#6d28d9,#7c3aed)", border:"rgba(139,92,246,0.5)"  },
  admin:    { label:"Admin",     color:"#db2777", glow:"rgba(219,39,119,0.5)",   bg:"linear-gradient(145deg,#be185d,#db2777)", border:"rgba(236,72,153,0.5)"   },
};

const DETAIL_ICONS = {
  Floors:"🏢", Department:"📚", Capacity:"👥", Established:"📅", Area:"📐",
  Sports:"⚽", Lighting:"💡", Type:"🏷️", Security:"🔒", Amenities:"✨",
  Programs:"📖", Rooms:"🛏️", "Active startups":"💡", Mentors:"👨‍🏫",
  Funding:"💰", Recognition:"🏅", Fleet:"🚌", Routes:"🗺️", Timings:"⏰",
  Tracking:"📡", Events:"🎉", Rating:"⭐", Faiths:"🛐", Blocks:"🏗️",
  Affiliation:"🎓", Accreditation:"✅", Labs:"🔬", Intake:"📊",
  Duration:"⏱️", Charges:"💳", NAAC:"🏅", "UG Programs":"📖", "PG Programs":"📖", Year:"📅",
};

const FILTERS = [
  { cat:"all",      label:"All" },
  { cat:"academic", label:"🏛️ Academic" },
  { cat:"hostel",   label:"🏠 Hostels"  },
  { cat:"ground",   label:"⚽ Grounds"  },
  { cat:"facility", label:"🔧 Facilities" },
  { cat:"admin",    label:"🚀 Admin"    },
];

// ─── Building block ───
function Building({ b, visible, searchHit, isSelected, onClick }) {
  const meta = CAT_META[b.cat];
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={b.name}
      style={{
        position:"absolute", left:b.x, top:b.y, width:b.w, height:b.h,
        background:meta.bg, border:`1px solid ${meta.border}`, borderRadius:8,
        cursor:"pointer", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", gap:2, padding:"4px 3px",
        textAlign:"center", opacity:visible ? 1 : 0.14,
        pointerEvents:visible ? "auto" : "none",
        zIndex:isSelected ? 25 : hov ? 20 : 10,
        transform:hov ? "translateY(-4px) scale(1.06)" : "none",
        transition:"transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s, opacity 0.3s",
        boxShadow:isSelected ? `0 0 0 2px #f59e0b, 0 0 18px ${meta.glow}` : hov ? "0 10px 28px rgba(0,0,0,0.55)" : "0 4px 14px rgba(0,0,0,0.4)",
        outline:searchHit && visible ? "2px solid #f59e0b" : "none", outlineOffset:2,
      }}
    >
      <span style={{ fontSize:14, lineHeight:1 }}>{b.icon}</span>
      <span style={{ fontSize:7.5, fontWeight:700, color:"rgba(255,255,255,0.95)", lineHeight:1.25, textShadow:"0 1px 3px rgba(0,0,0,0.6)" }}>{b.name}</span>
    </button>
  );
}

// ─── Info panel ───
function InfoPanel({ building, onClose }) {
  const meta = building ? CAT_META[building.cat] : null;
  return (
    <div style={{
      position:"fixed", top:0, right:building ? 0 : -400, bottom:0, width:370,
      background:"linear-gradient(160deg,rgba(8,14,26,0.97) 0%,rgba(18,14,52,0.97) 100%)",
      backdropFilter:"blur(24px)", borderLeft:"1px solid rgba(255,255,255,0.1)",
      transition:"right 0.4s cubic-bezier(0.4,0,0.2,1)", zIndex:9999,
      display:"flex", flexDirection:"column", overflow:"hidden", fontFamily:"'Inter',sans-serif",
    }}>
      {building && meta && (
        <>
          <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)", position:"relative" }}>
            <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,0.08)", border:"none", color:"#94a3b8", width:30, height:30, borderRadius:8, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
            <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10, background:`${meta.color}22`, color:meta.color, border:`1px solid ${meta.color}44` }}>
              {building.icon} {meta.label}
            </span>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:800, color:"#f1f5f9", lineHeight:1.25, marginBottom:6 }}>{building.name}</div>
            {building.alias && <div style={{ fontSize:12, color:"#64748b", marginBottom:8 }}>Also known as: {building.alias}</div>}
            <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.65 }}>{building.desc}</div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"16px 20px 20px" }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"#475569", marginBottom:10 }}>Details</div>
            {Object.entries(building.details || {}).map(([k, v]) => (
              <div key={k} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 12px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, marginBottom:8, fontSize:12 }}>
                <span style={{ fontSize:15, width:20, textAlign:"center", flexShrink:0 }}>{DETAIL_ICONS[k] || "📌"}</span>
                <div>
                  <div style={{ fontWeight:600, color:"#cbd5e1", marginBottom:2, textTransform:"capitalize" }}>{k}</div>
                  <div style={{ color:"#64748b" }}>{v}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───
export default function CampusMap() {
  const [activeCat, setActiveCat] = useState("all");
  const [search,    setSearch]    = useState("");
  const [selected,  setSelected]  = useState(null);
  const [zoom,      setZoom]      = useState(1);
  const scrollRef = useRef(null);

  const q = search.toLowerCase().trim();
  const isVisible = useCallback((b) => {
    const catOk    = activeCat === "all" || b.cat === activeCat;
    const searchOk = !q || b.name.toLowerCase().includes(q) || (b.alias||"").toLowerCase().includes(q) || (b.desc||"").toLowerCase().includes(q) || b.cat.includes(q);
    return catOk && searchOk;
  }, [activeCat, q]);

  const counts = BUILDINGS.reduce((a, b) => { a[b.cat] = (a[b.cat]||0)+1; return a; }, {});
  const handleZoom = (f) => setZoom(z => Math.min(2, Math.max(0.5, z * f)));

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const fn = (e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(z => Math.min(2, Math.max(0.5, z*(e.deltaY<0?1.1:0.91)))); } };
    el.addEventListener("wheel", fn, { passive:false });
    return () => el.removeEventListener("wheel", fn);
  }, []);

  const barStyle = { display:"flex", gap:20, alignItems:"center", padding:"6px 16px", background:"rgba(0,0,0,0.25)", borderBottom:"1px solid rgba(255,255,255,0.05)", fontSize:12, color:"#64748b", flexShrink:0 };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 120px)", background:"#060b15", fontFamily:"'Inter',sans-serif", minHeight:0, borderRadius:12, overflow:"hidden" }}>

      {/* Toolbar */}
      <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", padding:"10px 16px", background:"linear-gradient(135deg,#080e1a 0%,#14103a 100%)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        {/* Search */}
        <div style={{ position:"relative", flex:1, maxWidth:320 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#475569", pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search buildings, grounds, facilities…"
            style={{ width:"100%", padding:"8px 14px 8px 38px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, color:"#e2e8f0", fontFamily:"'Inter',sans-serif", fontSize:13, outline:"none" }} />
        </div>
        {/* Filters */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {FILTERS.map(f => {
            const active = activeCat === f.cat;
            const col = f.cat==="all" ? "#f59e0b" : (CAT_META[f.cat]?.color || "#f59e0b");
            return (
              <button key={f.cat} onClick={() => setActiveCat(f.cat)} style={{ padding:"5px 12px", borderRadius:20, border:`1px solid ${active ? col : "rgba(255,255,255,0.1)"}`, background:active ? col : "transparent", color:active ? (f.cat==="ground"||f.cat==="all" ? "#000":"#fff") : "#94a3b8", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}>{f.label}</button>
            );
          })}
        </div>
        {/* Zoom */}
        <div style={{ display:"flex", gap:4, marginLeft:"auto" }}>
          {[["＋",1.2],["－",0.83],["⟳",null]].map(([l,f]) => (
            <button key={l} onClick={() => f ? handleZoom(f) : setZoom(1)} style={{ width:28, height:28, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:8, color:"#fff", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Stat bar */}
      <div style={barStyle}>
        <span>🏛️ <b style={{ color:"#f59e0b" }}>{counts.academic||0}</b> Academic</span>
        <span>🏠 <b style={{ color:"#10b981" }}>{counts.hostel||0}</b> Hostels</span>
        <span>⚽ <b style={{ color:"#f59e0b" }}>{counts.ground||0}</b> Grounds</span>
        <span>🔧 <b style={{ color:"#a855f7" }}>{counts.facility||0}</b> Facilities</span>
        <span>🚀 <b style={{ color:"#ec4899" }}>{counts.admin||0}</b> Admin</span>
        <span style={{ marginLeft:"auto" }}>📍 Click any building for details</span>
      </div>

      {/* Scrollable map */}
      <div ref={scrollRef} style={{ flex:1, overflow:"auto", padding:16 }}>
        <div style={{ position:"relative", width:1200, height:750, background:"#1c3a18", borderRadius:18, overflow:"hidden", boxShadow:"0 30px 80px rgba(0,0,0,0.6)", transform:`scale(${zoom})`, transformOrigin:"top left", transition:"transform 0.25s", margin:"0 auto" }}>

          {/* Grass overlay */}
          <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", background:"radial-gradient(ellipse at 15% 60%, rgba(34,197,94,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 25%, rgba(34,197,94,0.08) 0%, transparent 50%), linear-gradient(160deg,#18351a 0%,#1e4220 45%,#1a3a18 100%)" }} />

          {/* Roads */}
          {[{ top:180,left:0,right:0,height:20 },{ top:302,left:0,right:0,height:28 }].map((r,i) => (
            <div key={i} style={{ position:"absolute", background:"#161e2e", zIndex:2, ...r }} />
          ))}
          <div style={{ position:"absolute", background:"#161e2e", zIndex:2, left:340, top:0, bottom:0, width:26 }} />
          <div style={{ position:"absolute", background:"#161e2e", zIndex:2, left:510, top:316, bottom:0, width:22 }} />
          <div style={{ position:"absolute", background:"#161e2e", zIndex:2, top:432, left:148, width:390, height:18 }} />
          {[190,316].map(t => <div key={t} style={{ position:"absolute", zIndex:3, top:t, left:0, right:0, borderTop:"2px dashed rgba(255,255,255,0.06)", pointerEvents:"none" }} />)}

          {/* Roundabout */}
          <div style={{ position:"absolute", left:301, top:271, width:78, height:78, borderRadius:"50%", background:"#1e4220", border:"12px solid #161e2e", zIndex:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"radial-gradient(circle at 40% 35%,#4ade80,#16a34a)", boxShadow:"0 0 12px rgba(74,222,128,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🌳</div>
          </div>

          {/* Water Pond */}
          <div style={{ position:"absolute", left:376, top:322, width:90, height:62, borderRadius:"40% 60% 55% 45% / 50% 45% 55% 50%", background:"linear-gradient(135deg,#0c4a6e,#0ea5e9)", border:"2px solid rgba(56,189,248,0.4)", zIndex:5, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, boxShadow:"0 0 20px rgba(14,165,233,0.3)" }}>
            <span style={{ fontSize:16 }}>💧</span>
            <span style={{ fontSize:8, fontWeight:600, color:"#7dd3fc", textAlign:"center" }}>Water<br/>Pond</span>
          </div>

          {/* Hango Garden */}
          <div style={{ position:"absolute", left:438, top:214, width:88, height:68, background:"rgba(34,197,94,0.12)", border:"1px dashed rgba(74,222,128,0.4)", borderRadius:8, zIndex:4, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2 }}>
            <span style={{ fontSize:18 }}>🌸</span>
            <span style={{ fontSize:8, color:"#4ade80", fontWeight:600, textAlign:"center" }}>Hango<br/>Garden</span>
          </div>

          {/* Trees */}
          {[[93,190],[220,192],[635,190],[780,192],[155,260],[255,365],[640,362],[700,145],[850,158],[970,195],[1020,295],[160,448],[480,450]].map(([l,t],i) => (
            <span key={i} style={{ position:"absolute", left:l, top:t, zIndex:3, fontSize:16, pointerEvents:"none", userSelect:"none" }}>{i%2===0?"🌳":"🌲"}</span>
          ))}

          {/* Entrance */}
          <div style={{ position:"absolute", left:0, top:308, zIndex:15, background:"linear-gradient(90deg,#f59e0b,#ef4444)", color:"#000", fontSize:9, fontWeight:800, padding:"4px 10px", borderRadius:"0 6px 6px 0", letterSpacing:"0.5px", textTransform:"uppercase" }}>⬅ MAIN GATE</div>

          {/* Compass */}
          <div style={{ position:"absolute", top:14, right:14, zIndex:50, width:52, height:52, background:"rgba(8,14,26,0.75)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🧭</div>

          {/* Legend */}
          <div style={{ position:"absolute", bottom:14, left:14, zIndex:50, background:"rgba(8,14,26,0.82)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 14px" }}>
            <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#475569", marginBottom:7 }}>Legend</div>
            {Object.entries(CAT_META).map(([k,m]) => (
              <div key={k} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4, fontSize:10, color:"#94a3b8" }}>
                <div style={{ width:10, height:10, borderRadius:3, background:m.color }} />{m.label}
              </div>
            ))}
          </div>

          {/* Road labels */}
          {[{ s:{ left:60, top:172 }, t:"University Avenue" },{ s:{ left:380, top:285, writingMode:"vertical-rl" }, t:"Main Campus Rd" },{ s:{ left:530, top:350, writingMode:"vertical-rl" }, t:"East Campus Rd" }].map((rl,i) => (
            <div key={i} style={{ position:"absolute", zIndex:8, fontSize:8, fontWeight:600, color:"rgba(255,255,255,0.18)", textTransform:"uppercase", letterSpacing:"0.8px", pointerEvents:"none", ...rl.s }}>{rl.t}</div>
          ))}

          {/* Buildings */}
          {BUILDINGS.map(b => (
            <Building key={b.id} b={b} visible={isVisible(b)} searchHit={q && isVisible(b)} isSelected={selected?.id === b.id} onClick={() => setSelected(b)} />
          ))}
        </div>
      </div>

      {/* Info panel */}
      <InfoPanel building={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
