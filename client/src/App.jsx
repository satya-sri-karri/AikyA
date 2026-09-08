import { lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar, { BottomNav } from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import EmergencyFab from "./components/EmergencyFab.jsx";

const Landing = lazy(() => import("./pages/Landing.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const CampusMapPage = lazy(() => import("./pages/CampusMap.jsx"));
const Faculty = lazy(() => import("./pages/Faculty.jsx"));
const Departments = lazy(() => import("./pages/Departments.jsx"));
const Canteen = lazy(() => import("./pages/Canteen.jsx"));
const Hostels = lazy(() => import("./pages/Hostels.jsx"));
const Buses = lazy(() => import("./pages/Buses.jsx"));
const Events = lazy(() => import("./pages/Events.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));

function AppLoading() {
  return (
    <div className="app-loading">
      <div className="brand-mark">✦</div>
      <div className="app-loading-dots"><span /><span /><span /></div>
    </div>
  );
}

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
      <CampusMapPage />
    </AppShell>
  );
}

export default function App() {
  return (
    <Suspense fallback={<AppLoading />}>
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
    </Suspense>
  );
}