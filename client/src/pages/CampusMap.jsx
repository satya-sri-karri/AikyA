import CampusMap from "../components/CampusMap.jsx";
import { PageHeader } from "../components/ui.jsx";

export default function CampusMapPage() {
  return (
    <div>
      <PageHeader
        kicker="Explore"
        title="Campus Map"
        sub="Pan, zoom and click any building — this is the digital twin of your campus."
      />
      <CampusMap mode="page" />
    </div>
  );
}