import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Siren, X } from "lucide-react";
import { useUniverse } from "../lib/useUniverse.js";
import { motion, AnimatePresence } from "framer-motion";

export default function EmergencyFab() {
  const [open, setOpen] = useState(false);
  const { data } = useUniverse(["pois", "buses"]);
  const navigate = useNavigate();

  const pois = data.pois || [];
  const medical = pois.find((p) => (p.name || "").toLowerCase().includes("medical")) || pois.find((p) => p.type === "service");
  const contacts = [
    ...pois.filter((p) => p.type === "hostel").map((h) => ({ label: `${h.name} warden`, value: h.contact })),
    ...(data.buses || []).map((b) => ({ label: `Bus ${b.routeNumber} driver`, value: b.driverContact })),
  ].filter((c) => c.value);

  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button className="emergency-fab" onClick={() => setOpen(true)}>
        <Siren size={18} /> Emergency
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="emergency-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="emergency-panel"
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="emergency-head">
                <div style={{ width: 46, height: 46, borderRadius: 14, background: "var(--danger-soft)", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Siren size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: 22 }}>Emergency Mode</h2>
                  <p className="muted">What do you need right now?</p>
                </div>
                <button className="icon-btn" style={{ marginLeft: "auto" }} onClick={() => setOpen(false)}><X size={16} /></button>
              </div>

              <div className="emergency-opts">
                <button className="emergency-opt" onClick={() => medical && navigate("/map")}>
                  <span style={{ fontSize: 26 }}>🚑</span> Medical
                </button>
                <button className="emergency-opt" onClick={() => navigate("/map")}>
                  <span style={{ fontSize: 26 }}>🛡️</span> Security
                </button>
                <button className="emergency-opt" onClick={() => navigate("/map")}>
                  <span style={{ fontSize: 26 }}>🔥</span> Fire
                </button>
                <button className="emergency-opt" onClick={() => contacts.length && navigate("/")}>
                  <span style={{ fontSize: 26 }}>📞</span> Contacts
                </button>
              </div>

              <div style={{ marginTop: 18, padding: "14px 16px", borderRadius: 16, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                {medical ? (
                  <>
                    <div className="micro" style={{ marginBottom: 6 }}>Nearest medical facility</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <strong style={{ flex: 1 }}>{medical.name}</strong>
                      <button className="btn btn-primary" style={{ padding: "8px 12px", fontSize: 13 }} onClick={() => navigate("/map")}>
                        View on map
                      </button>
                    </div>
                    <p className="muted" style={{ marginTop: 6 }}>{medical.description || medical.openHours}</p>
                  </>
                ) : (
                  <p className="muted">Medical facility details unavailable.</p>
                )}
              </div>

              {contacts.length > 0 && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  {contacts.slice(0, 3).map((c) => (
                    <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 13 }}>
                      <span style={{ flex: 1, color: "var(--text-weak)" }}>{c.label}</span>
                      <strong>{c.value}</strong>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}