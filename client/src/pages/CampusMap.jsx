import { useState } from "react";
import CampusMap from "../components/CampusMap.jsx";
import AdityaUniversityMap from "../components/AdityaUniversityMap.jsx";
import { PageHeader } from "../components/ui.jsx";

const TABS = [
  { id: "live",   label: "🗺️ Live Map",           sub: "Real-time POIs, navigation & indoor floor plans" },
  { id: "layout", label: "🏛️ Campus Layout",       sub: "Interactive Aditya University campus layout map" },
];

export default function CampusMapPage() {
  const [tab, setTab] = useState("live");

  return (
    <div>
      <PageHeader
        kicker="Explore"
        title="Campus Map"
        sub={
          tab === "live"
            ? "Pan, zoom and click any building — this is the digital twin of your campus."
            : "Explore the Aditya University campus layout. Click any building for details."
        }
        actions={
          <div className="seg-ctrl" role="tablist" aria-label="Map views">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                className={`seg-tab${tab === t.id ? " active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        }
      />

      <div style={{ marginTop: 8 }}>
        {tab === "live"   && <CampusMap mode="page" />}
        {tab === "layout" && <AdityaUniversityMap />}
      </div>
    </div>
  );
}