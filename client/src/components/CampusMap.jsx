import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Plus, Minus, Fullscreen, X, Navigation } from "lucide-react";
import { useUniverse, projectPOI, getCampusConfig } from "../lib/useUniverse.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { StatusBadge } from "./ui.jsx";

const CAT = {
  block: { label: "Blocks", color: "#6D5EF8", icon: "🏢" },
  library: { label: "Library", color: "#2E7CF6", icon: "📚" },
  shop: { label: "Food", color: "#E5A00D", icon: "🍴" },
  hostel: { label: "Hostels", color: "#1E9E5A", icon: "🏠" },
  ground: { label: "Grounds", color: "#58A65C", icon: "🌳" },
  office: { label: "Offices", color: "#8A8FA3", icon: "🏛️" },
  service: { label: "Services", color: "#EC6B4F", icon: "🩺" },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "block", label: "Blocks" },
  { key: "shop", label: "Food" },
  { key: "hostel", label: "Hostels" },
  { key: "library", label: "Library" },
  { key: "ground", label: "Grounds" },
  { key: "service", label: "Services" },
];

const CONFIG = getCampusConfig();

/* Fixed canvas decoration (zones, roads, gate, gardens, pond). */
function Decorations() {
  return (
    <g>
      {/* zones */}
      <rect x={700} y={40} width={470} height={200} rx={24} fill="rgba(109,94,248,0.05)" stroke="rgba(109,94,248,0.18)" strokeDasharray="6 6" />
      <text x={930} y={30} textAnchor="middle" className="map-zone-label">RESIDENTIAL ZONE</text>
      <rect x={30} y={300} width={330} height={230} rx={24} fill="rgba(30,158,90,0.06)" stroke="rgba(30,158,90,0.2)" strokeDasharray="6 6" />
      <text x={195} y={284} textAnchor="middle" className="map-zone-label">ACADEMIC ZONE</text>
      <rect x={700} y={540} width={470} height={190} rx={24} fill="rgba(46,124,246,0.05)" stroke="rgba(46,124,246,0.16)" strokeDasharray="6 6" />
      <text x={930} y={522} textAnchor="middle" className="map-zone-label">ADMIN & SERVICES</text>

      {/* central lawn + pond */}
      <ellipse cx={600} cy={420} rx={220} ry={120} fill="rgba(88,166,92,0.14)" />
      <ellipse cx={600} cy={420} rx={150} ry={70} fill="rgba(58,142,90,0.2)" />
      <rect x={575} y={398} width={50} height={44} rx={22} fill="rgba(16,122,196,0.35)" />
      <text x={600} y={470} textAnchor="middle" className="building-label-small">Central Quad</text>

      {/* entrance */}
      <rect x={45} y={322} width={20} height={150} rx={10} fill="#3A3D46" />
      <rect x={20} y={330} width={70} height={30} rx={14} fill="#17181A" stroke="rgba(255,255,255,0.15)" />
      <text x={55} y={349} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: "#fff" }}>GATE</text>
      <text x={120} y={352} className="building-label-small">Main Gate</text>

      {/* trees */}
      {[[210, 250], [320, 260], [480, 300], [520, 520], [700, 280], [810, 300], [1080, 260], [90, 560], [640, 180]].map(([x, y], i) => (
        <text key={i} x={x} y={y} fontSize={16}>{["🌳", "🌲", "🌳", "🌴", "🌳", "🌲"][i % 6]}</text>
      ))}
    </g>
  );
}

function Pin({ poi, pos, color, icon, dimmed, selected, onSelect, label }) {
  return (
    <g transform={`translate(${pos.x}, ${pos.y})`} className={`map-pin${dimmed ? " dimmed" : ""}`} onClick={(e) => { e.stopPropagation(); onSelect(poi); }} style={{ opacity: dimmed ? 0.3 : 1, cursor: "pointer" }}>
      {selected && <circle r={16} fill="none" stroke={color} strokeWidth={2.5} className="pin-pulse" />}
      <circle r={selected ? 11 : 8.5} fill={color} stroke="#fff" strokeWidth={2.5} opacity={selected ? 1 : 0.92} />
      {!selected && <text y={-18} textAnchor="middle" fontSize={13}>{icon}</text>}
      {label !== false && (
        <text y={-26} textAnchor="middle" className="building-label-small" style={{ fontWeight: 700, fill: dimmed ? undefined : "#55554F" }}>
          {poi.name}
        </text>
      )}
    </g>
  );
}

function BlockShape({ poi, pos, color, dimmed, selected, onSelect }) {
  return (
    <g
      transform={`translate(${pos.x}, ${pos.y})`}
      className={`map-building${dimmed ? " dimmed" : ""}`}
      style={{ opacity: dimmed ? 0.3 : 1 }}
      onClick={(e) => { e.stopPropagation(); onSelect(poi); }}
    >
      <rect x={-62} y={-30} width={124} height={60} rx={14} fill={color} opacity={0.92} stroke="#fff" strokeWidth={2.5}>
        {selected && <animate attributeName="opacity" values="0.92;0.78;0.92" dur="1.4s" repeatCount="indefinite" />}
      </rect>
      <text y={-4} textAnchor="middle" fontSize={17}>{poi.icon || "🏢"}</text>
      <text y={12} textAnchor="middle" className="building-label-small" style={{ fill: "#fff", fontWeight: 700 }}>{poi.name}</text>
      {selected && <rect x={-66} y={-34} width={132} height={68} rx={16} fill="none" stroke="#fff" strokeWidth={2} />}
    </g>
  );
}

function BuildingDetail({
  poi, faculty, departments, onClose, onNavigate,
}) {
  const blockMatches = (value) =>
    (value || "").trim().toLowerCase() === (poi.name || "").trim().toLowerCase();

  const depts = departments.filter((d) => blockMatches(d.block));
  const profs = faculty.filter((f) => blockMatches(f.block));

  // Floors present in the data for this block (from departments + faculty).
  const floors = useMemo(() => {
    const set = new Set();
    depts.forEach((d) => d.floor && set.add(d.floor));
    profs.forEach((f) => f.floor && set.add(f.floor));
    return ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"].filter((floor) =>
      set.has(floor) || set.size === 0);
  }, [depts, profs]);

  const [floor, setFloor] = useState(floors[0] || "Ground Floor");
  useEffect(() => {
    setFloor(floors[0] || "Ground Floor");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poi._id]);
  const onFloorProfs = profs.filter((f) => (f.floor || "").toLowerCase() === (floor || "").toLowerCase());
  const onFloorDepts = depts.filter((d) => (d.floor || "").toLowerCase() === (floor || "").toLowerCase());
  const roomsOnFloor = [
    ...onFloorDepts.flatMap((d) => (d.labs || []).map((lab) => ({ name: lab, kind: "lab", dept: d.name }))),
    ...onFloorProfs.map((f) => ({ name: f.cabin, kind: "cabin", who: f })),
  ];

  return (
    <div className="map-detail">
      <button className="icon-btn map-detail-close" onClick={onClose}><X size={16} /></button>
      <div className="map-detail-head">
        <StatusBadge status={poi.isOpenNow ? "open" : "closed"} />
        <h2 style={{ fontSize: 22, margin: "8px 0 4px", paddingRight: 30 }}>{poi.name}</h2>
        <p className="muted">{poi.description || CAT[poi.type]?.label}</p>
        <p className="muted" style={{ fontSize: 12 }}>{poi.openHours && <>🕐 {poi.openHours}</>} {poi.block && poi.block !== poi.name && <>· 📍 {poi.block}</>}</p>
      </div>
      <div className="map-detail-body">
        {poi.accessPolicy && (
          <div className="badge badge-restricted" style={{ alignSelf: "flex-start" }}>
            {poi.accessPolicy.note || "Restricted access"}
          </div>
        )}

        {poi.type === "shop" && (
          <>
            <h4>Menu</h4>
            <ul className="menu-list">
              {(poi.items || []).map((item) => (
                <li key={item.name}>
                  <span className="menu-name">{item.name}</span>
                  {item.available ? (
                    <span className="menu-price">₹{item.price}</span>
                  ) : (
                    <span className="menu-sold">Sold out</span>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        {poi.type === "hostel" && (
          <div className="rc-rows">
            <div className="rc-row">🛏️ {poi.vacantRooms} vacant of {poi.totalRooms} rooms</div>
            <div className="rc-row">🛡️ Warden: {poi.warden}</div>
            <div className="rc-row">📞 {poi.contact}</div>
          </div>
        )}

        {(poi.type === "block" || (depts.length || profs.length)) && (
          <>
            <h4>Floors</h4>
            <div className="floor-selector">
              {floors.map((f) => (
                <button key={f} className={`floor-btn${f === floor ? " active" : ""}`} onClick={() => setFloor(f)}>
                  {f.replace(" Floor", "")}
                </button>
              ))}
            </div>

            {depts.length > 0 && (
              <>
                <h4>Departments</h4>
                <div className="rc-rows">
                  {depts.map((d) => (
                    <div key={d._id} className="rc-row">
                      <span>🎓</span><span><strong>{d.name}</strong> · {d.hod} · {d.officeHours}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {roomsOnFloor.length > 0 && (
              <>
                <h4>{floor} rooms</h4>
                <div className="floor-plan">
                  <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 8 }}>
                    {roomsOnFloor.map((r, i) => (
                      <div key={i} className="room-cell" title={r.kind === "lab" ? `${r.name} · ${r.dept}` : `${r.who.name} · ${r.who.designation}`}>
                        <div className="rc-room-no">{r.name}</div>
                        <div className="rc-room-name">{r.kind === "lab" ? "Lab" : "Faculty"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {profs.length > 0 && (
              <>
                <h4>Faculty in this block</h4>
                <div className="rc-rows">
                  {profs.map((f) => (
                    <div key={f._id} className="rc-row">
                      <span>👨‍🏫</span>
                      <span><strong>{f.name}</strong> · {f.designation} · {f.cabin}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <div style={{ marginTop: "auto", display: "flex", gap: 8, paddingTop: 8 }}>
          <button className="btn btn-primary" onClick={() => onNavigate(poi)}>
            <Navigation size={15} /> Navigate
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CampusMap({ mode = "page", onNavigate, height }) {
  const { data } = useUniverse();
  const { theme } = useTheme();
  const pois = data.pois || [];
  const buses = data.buses || [];
  const faculty = data.faculty || [];
  const departments = data.departments || [];

  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState({ k: 1, tx: 0, ty: 0 });
  const outerRef = useRef(null);
  const dragRef = useRef(null);

  const cfg = CONFIG;

  const projected = useMemo(
    () => pois.map((poi) => ({ poi, pos: projectPOI(poi, cfg) })),
    [pois, cfg]
  );

  const visible = useCallback(
    (poi) => {
      const catOk = filter === "all" || poi.type === filter;
      const qq = q.trim().toLowerCase();
      const searchOk =
        !qq ||
        (poi.name || "").toLowerCase().includes(qq) ||
        (poi.block || "").toLowerCase().includes(qq) ||
        (poi.description || "").toLowerCase().includes(qq);
      return catOk && searchOk;
    },
    [filter, q]
  );

  const routePoi = buses[0];

  function handleWheel(e) {
    const rect = outerRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    setView((v) => {
      const k = Math.min(2.6, Math.max(0.5, v.k * factor));
      const ratio = (factor - 1) / factor;
      return {
        k,
        tx: px - (px - v.tx) * ratio,
        ty: py - (py - v.ty) * ratio,
      };
    });
  }

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty, moved: false };
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) dragRef.current.moved = true;
    setView((v) => ({ ...v, tx: dragRef.current.tx + dx, ty: dragRef.current.ty + dy }));
  };
  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const zoomBy = (f) =>
    setView((v) => {
      const k = Math.min(2.6, Math.max(0.6, v.k * f));
      const cx = (outerRef.current?.clientWidth || 600) / 2;
      const cy = (outerRef.current?.clientHeight || 400) / 2;
      const ratio = (f - 1) / f;
      return { k, tx: cx - (cx - v.tx) * ratio, ty: cy - (cy - v.ty) * ratio };
    });

  const resetView = () => setView({ k: 1, tx: 0, ty: 0 });

  const mapHeight = height || (mode === "dashboard" ? 340 : undefined);
  const isDark = theme === "dark";
  const road = isDark ? "#24262A" : "#FBFAF6";
  const roadLine = isDark ? "#2E3136" : "#E4E2D8";

  return (
    <div className="map-shell" style={mapHeight ? { height: mapHeight } : { height: "min(72vh, 680px)" }}>
      {mode === "page" && (
        <div className="map-toolbar">
          <div className="search-box" style={{ flex: 1 }}>
            <span className="search-icon">🔍</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter markers on the map…"
            />
          </div>
          <div className="map-filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`map-filter${filter === f.key ? " active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        ref={outerRef}
        className={`map-canvas-outer${dragging ? " dragging" : ""}`}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="map-canvas-inner" style={{ width: cfg.canvasWidth, height: cfg.canvasHeight }}>
          <svg
            viewBox={`0 0 ${cfg.canvasWidth} ${cfg.canvasHeight}`}
            width={cfg.canvasWidth}
            height={cfg.canvasHeight}
            style={{ transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.k})`, transformOrigin: "0 0", background: "var(--map-bg)", display: "block" }}
          >
            <Decorations />

            {/* roads */}
            <rect x={0} y={288} width={cfg.canvasWidth} height={26} fill={road} />
            <rect x={150} y={262} width={24} height={520} fill={road} />
            <rect x={648} y={0} width={22} height={760} fill={road} />
            <rect x={0} y={520} width={160} height={420} fill={road} transform="skewY(-6)" transform-origin="0 520" />
            <line x1={0} y1={300} x2={cfg.canvasWidth} y2={300} stroke={roadLine} strokeDasharray="10 8" strokeWidth={2} />
            <line x1={162} y1={0} x2={162} y2={760} stroke={roadLine} strokeDasharray="10 8" strokeWidth={2} />

            {/* bus route overlay */}
            <path
              d="M 60 300 C 300 150, 480 200, 600 300 S 900 430, 1080 430"
              fill="none"
              stroke="#E5A00D"
              strokeWidth={4}
              strokeDasharray="1 12"
              strokeLinecap="round"
              opacity={0.75}
            />
            {routePoi && (
              <g>
                {(routePoi.stops || []).slice(0, 4).map((s, i) => {
                  const anchors = [
                    { x: 60, y: 300 }, { x: 360, y: 170 }, { x: 600, y: 300 }, { x: 870, y: 430 },
                  ];
                  const p = anchors[i] || anchors[anchors.length - 1];
                  return (
                    <g key={i} transform={`translate(${p.x}, ${p.y})`}>
                      {i === 0 && <circle r={12} fill="none" stroke="#E5A00D" strokeWidth={2} className="pin-pulse" />}
                      <circle r={7} fill="#E5A00D" stroke="#fff" strokeWidth={2} />
                      <text y={-14} textAnchor="middle" className="building-label-small" style={{ fill: "#B36B00" }}>{s.name}</text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* POIs */}
            {projected.map(({ poi, pos }) => {
              const meta = CAT[poi.type] || CAT.office;
              const vis = visible(poi);
              const sel = selected?._id === poi._id;
              if (poi.type === "block") {
                return (
                  <BlockShape key={poi._id} poi={poi} pos={pos} color={meta.color} dimmed={!vis} selected={sel} onSelect={(p) => { setSelected(p); setQ(""); }} />
                );
              }
              return (
                <Pin key={poi._id} poi={poi} pos={pos} color={meta.color} icon={meta.icon} dimmed={!vis} selected={sel} onSelect={setSelected} />
              );
            })}
          </svg>
        </div>
      </div>

      {mode === "page" && (
        <>
          <div className="map-controls">
            <button className="icon-btn" onClick={() => zoomBy(1.25)} title="Zoom in"><Plus size={17} /></button>
            <button className="icon-btn" onClick={() => zoomBy(0.8)} title="Zoom out"><Minus size={17} /></button>
            <button className="icon-btn" onClick={resetView} title="Reset"><Fullscreen size={16} /></button>
          </div>
          <div className="map-legend">
            <div className="micro" style={{ marginBottom: 6 }}>Legend</div>
            {Object.entries(CAT).map(([k, m]) => (
              <div key={k} className="legend-row">
                <span className="legend-dot" style={{ background: m.color }} />
                {m.label}
              </div>
            ))}
          </div>
        </>
      )}

      {mode === "dashboard" && (
        <div className="map-legend" style={{ left: 12, bottom: 12 }}>
          <div className="legend-row">
            <span className="legend-dot" style={{ background: "#E5A00D" }} />
            Bus route
          </div>
          <div className="legend-row">
            <span className="legend-dot" style={{ background: "var(--accent)" }} />
            Blocks
          </div>
          <div className="legend-row">
            <span className="legend-dot" style={{ background: "#E5A00D" }} />
            Food
          </div>
        </div>
      )}

      {selected && (
        <BuildingDetail
          poi={selected}
          faculty={faculty}
          departments={departments}
          onClose={() => setSelected(null)}
          onNavigate={(poi) => onNavigate?.(poi)}
        />
      )}
    </div>
  );
}