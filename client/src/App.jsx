import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar, { BottomNav } from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import EmergencyFab from "./components/EmergencyFab.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CampusMap from "./pages/CampusMap.jsx";
import Faculty from "./pages/Faculty.jsx";
import Departments from "./pages/Departments.jsx";
import Canteen from "./pages/Canteen.jsx";
import Hostels from "./pages/Hostels.jsx";
import Buses from "./pages/Buses.jsx";
import Events from "./pages/Events.jsx";
import Admin from "./pages/Admin.jsx";

function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(
    () => window.innerWidth > 1280 ? false : window.innerWidth > 1024
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="app-main">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <div className="app-content">{children}</div>
      </div>
      <BottomNav />
      <ChatWidget />
      <EmergencyFab />
    </div>
  );
}

function MapPage() {
  return (
    <AppShell>
      <CampusMap />
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/home" element={<Landing />} />
      <Route path="/" element={<AppShell><Dashboard /></AppShell>} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/faculty" element={<AppShell><Faculty /></AppShell>} />
      <Route path="/departments" element={<AppShell><Departments /></AppShell>} />
      <Route path="/canteen" element={<AppShell><Canteen /></AppShell>} />
      <Route path="/hostels" element={<AppShell><Hostels /></AppShell>} />
      <Route path="/buses" element={<AppShell><Buses /></AppShell>} />
      <Route path="/events" element={<AppShell><Events /></AppShell>} />
      <Route path="/admin" element={<AppShell><Admin /></AppShell>} />
    </Routes>
  );
}