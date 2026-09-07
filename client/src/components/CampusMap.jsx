import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Plus, Minus, Fullscreen, X, Navigation, Star } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useUniverse, CAMPUS_CENTER } from "../lib/useUniverse.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { useFavorites } from "../lib/useFavorites.js";
import { StatusBadge } from "./ui.jsx";
import DirectionsPanel from "./DirectionsPanel.jsx";

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

// Leaflet tile layer URLs (no API key needed). Dark tiles for dark mode.
const TILE_URL = {
  light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const GATE = { latitude: CAMPUS_CENTER.latitude + 0.0004, longitude: CAMPUS_CENTER.longitude - 0.0004 };

function BuildingDetail({
  poi, faculty, departments, onClose, onNavigate, favorite, onToggleFavorite, onVisit,
}) {
  const blockMatches = (value) =>
    (value || "").trim().toLowerCase() === (poi.name || "").trim().toLowerCase();

  useEffect(() => {
    onVisit?.(poi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poi._id]);

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
        <div style={{ position: "absolute", top: 42, right: 12, display: "flex", gap: 6 }}>
          <button
            className={`icon-btn${favorite ? " active-fav" : ""}`}
            onClick={() => onToggleFavorite(poi)}
            title={favorite ? "Remove from favorites" : "Save to favorites"}
          >
            <Star size={16} style={{ color: favorite ? "var(--warning)" : "var(--text-faint)", fill: favorite ? "var(--warning)" : "none" }} />
          </button>
        </div>
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
          {poi.latitude != null && (
            <a
              className="btn btn-soft"
              href={`https://www.google.com/maps/search/?api=1&query=${poi.latitude},${poi.longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation size={15} /> Open in Google Maps
            </a>
          )}
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
  const { isFavorite, toggleFavorite, recordVisit } = useFavorites();
  const pois = data.pois || [];
  const faculty = data.faculty || [];
  const departments = data.departments || [];

  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [routeTarget, setRouteTarget] = useState(null);

  const shellRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  /* Build the Leaflet map once. */
  useEffect(() => {
    const el = shellRef.current;
    if (!el || mapRef.current) return;

    const map = L.map(el, {
      center: [CAMPUS_CENTER.latitude, CAMPUS_CENTER.longitude],
      zoom: 16,
      minZoom: 14,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: true,
    });
    mapRef.current = map;

    const tile = L.tileLayer(TILE_URL[theme === "dark" ? "dark" : "light"], {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 20,
    });
    tile.addTo(map);

    map.on("click", () => setSelected(null));

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Keep the tile layer in sync with the theme. */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    let tile;
    map.eachLayer((l) => {
      if (l instanceof L.TileLayer) tile = l;
    });
    if (tile) {
      map.removeLayer(tile);
      L.tileLayer(TILE_URL[theme === "dark" ? "dark" : "light"], {
        attribution: TILE_ATTRIBUTION,
        maxZoom: 20,
      }).addTo(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

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

  /* Draw markers whenever POIs / filters / selection change. */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
    const layer = L.layerGroup();
    pois.forEach((poi) => {
      if (poi.latitude == null || poi.longitude == null) return;
      const meta = CAT[poi.type] || CAT.office;
      const isSel = selected?._id === poi._id;
      const isVisible = visible(poi);
      if (!isVisible) return;

      const icon = L.divIcon({
        className: "map-marker-shell",
        html: `
          <div class="map-marker${isSel ? " selected" : ""}" style="--dot:${meta.color}">
            <span class="marker-icon">${isSel ? `<span class="marker-ping" style="--dot:${meta.color}"></span>` : ""}${meta.icon}</span>
            <span class="marker-label">${poi.name}</span>
          </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([poi.latitude, poi.longitude], { icon, title: poi.name, zIndexOffset: isSel ? 1000 : 0 });
      marker.on("click", () => setSelected(poi));
      marker.addTo(layer);
    });
    layer.addTo(map);
    layerRef.current = layer;
  }, [pois, visible, selected]);

  const zoomBy = useCallback((dir) => {
    const map = mapRef.current;
    if (!map) return;
    map.zoomIn(dir);
  }, []);

  const resetView = () => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo([CAMPUS_CENTER.latitude, CAMPUS_CENTER.longitude], 16);
  };

  const mapHeight = height || (mode === "dashboard" ? 340 : undefined);

  const legendRows = Object.entries(CAT).filter(([k]) =>
    mode === "dashboard" ? ["block", "shop", "hostel", "library"].includes(k) : pois.some((p) => p.type === k)
  );

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
        ref={shellRef}
        className="leaflet-shell"
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0, zIndex: 0 }}
      />

      {mode === "page" && (
        <>
          <div className="map-controls">
            <button className="icon-btn" onClick={() => zoomBy(1)} title="Zoom in"><Plus size={17} /></button>
            <button className="icon-btn" onClick={() => zoomBy(-1)} title="Zoom out"><Minus size={17} /></button>
            <button className="icon-btn" onClick={resetView} title="Reset view"><Fullscreen size={16} /></button>
          </div>
          <div className="map-legend">
            <div className="micro" style={{ marginBottom: 6 }}>Legend</div>
            {legendRows.map(([k, m]) => (
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
            <span className="legend-dot" style={{ background: "var(--accent)" }} />
            Campus markers
          </div>
          <div className="legend-row">
            <span className="legend-dot" style={{ background: "#E5A00D" }} />
            Tap a marker for details
          </div>
        </div>
      )}

      {selected && (
        <BuildingDetail
          poi={selected}
          faculty={faculty}
          departments={departments}
          favorite={isFavorite(selected._id)}
          onToggleFavorite={toggleFavorite}
          onVisit={recordVisit}
          onClose={() => setSelected(null)}
          onNavigate={(poi) => (mode === "page" ? setRouteTarget(poi) : onNavigate?.(poi))}
        />
      )}

      {routeTarget && (
        <DirectionsPanel
          target={routeTarget}
          origin={GATE}
          onClose={() => setRouteTarget(null)}
        />
      )}
    </div>
  );
}