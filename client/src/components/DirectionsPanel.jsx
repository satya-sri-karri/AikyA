import { useMemo, useState } from "react";
import { Compass, X, LocateFixed, Accessibility, MapPinned, Footprints, Navigation } from "lucide-react";
import { distanceMeters, getCampusConfig, unproject } from "../lib/useUniverse.js";
import { useToast } from "../context/ToastContext.jsx";

const GATE_CANVAS = { x: 55, y: 345 }; // matches the drawn Main Gate on the map
const WALK_M_PER_MIN = 72;

function stepsFor(target, originName, accessible) {
  const floor = target.floor || "";
  const steps = [];
  steps.push(originName ? `Start from ${originName}` : "Start from the Main Gate");
  steps.push("Exit through the Main Gate");
  if (target.block && target.block !== target.name) {
    steps.push(`Follow the main road to ${target.block}`);
  } else {
    steps.push(`Follow the main road towards ${target.name}`);
  }
  steps.push(
    accessible
      ? "Take the accessible ramp / lift entrance"
      : floor
        ? `Take the stairs or lift to ${floor}`
        : "Enter at street level"
  );
  steps.push(`You've arrived at ${target.name}${floor ? ` — ${floor}` : ""}`);
  return steps;
}

export default function DirectionsPanel({ target, onClose }) {
  const [accessible, setAccessible] = useState(false);
  const [origin, setOrigin] = useState(null); // geolocation result; falls back to gate
  const [locating, setLocating] = useState(false);
  const { toast } = useToast();

  const gate = useMemo(() => {
    const cfg = getCampusConfig();
    return { ...unproject(GATE_CANVAS.x, GATE_CANVAS.y, cfg), name: "Main Gate" };
  }, []);

  const effectiveOrigin = origin || gate;

  const dist = useMemo(() => distanceMeters(effectiveOrigin, target), [effectiveOrigin, target]);
  const etaMin = dist ? Math.max(1, Math.round(dist / WALK_M_PER_MIN)) : null;

  const steps = useMemo(
    () => stepsFor(target, effectiveOrigin.name, accessible),
    [target, effectiveOrigin.name, accessible]
  );

  function useMyLocation() {
    if (!navigator.geolocation) {
      toast("Location isn't available on this device — starting from the Main Gate.", "warning");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setOrigin({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, name: "Your location" });
        toast("Using your current location.", "success");
      },
      () => {
        setLocating(false);
        setOrigin(null);
        toast("Couldn't find your location — starting from the Main Gate.", "warning");
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  }

  function start() {
    toast(`Route to ${target.name} is ready — follow the steps above.`, "success");
    onClose();
  }

  return (
    <div className="map-detail" style={{ width: "min(400px, 90vw)" }}>
      <button className="icon-btn map-detail-close" onClick={onClose}><X size={16} /></button>
      <div className="map-detail-head">
        <div className="micro" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <Compass size={13} /> Navigate to
        </div>
        <h2 style={{ fontSize: 22, paddingRight: 30 }}>{target.name}</h2>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <span className="badge badge-info"><MapPinned size={12} /> {dist != null ? `${dist} m` : "distance unavailable"}</span>
          <span className="badge badge-info"><Footprints size={12} /> {etaMin ? `≈ ${etaMin} min walk` : "ETA unavailable"}</span>
        </div>
      </div>

      <div className="map-detail-body" style={{ gap: 10 }}>
        <button className="btn btn-soft" style={{ width: "100%" }} onClick={useMyLocation} disabled={locating}>
          <LocateFixed size={14} /> {locating ? "Locating…" : effectiveOrigin.name !== "Main Gate" ? `From: ${effectiveOrigin.name}` : "Use my location"}
        </button>

        <button
          onClick={() => setAccessible((a) => !a)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "11px 14px", borderRadius: 14,
            background: accessible ? "var(--accent-soft)" : "var(--surface-2)",
            border: `1px solid ${accessible ? "var(--accent)" : "var(--border)"}`,
            cursor: "pointer", color: "var(--text)", width: "100%", textAlign: "left",
          }}
        >
          <Accessibility size={18} style={{ color: accessible ? "var(--accent-strong)" : "var(--text-faint)" }} />
          <span style={{ fontSize: 13.5, flex: 1 }}>
            <strong>Accessible route</strong>
            <span style={{ display: "block", color: "var(--text-weak)", fontSize: 12 }}>
              {accessible ? "On — ramps & lifts preferred" : "Off — fastest route"}
            </span>
          </span>
        </button>

        <div className="bus-route" style={{ padding: "6px 0" }}>
          {steps.map((s, i) => (
            <div key={i} className={`bus-stop${i === 0 ? " current" : ""}`}>
              <span className="bs-line" />
              <span className="bs-dot" />
              <span style={{ flex: 1, fontSize: 13.5 }}>{s}</span>
              {accessible && s.toLowerCase().includes("ramp") && <span className="badge badge-accent">♿</span>}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, paddingTop: 6 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={start}>
            <Navigation size={15} /> Start Navigation
          </button>
        </div>
      </div>
    </div>
  );
}