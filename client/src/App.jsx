import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CampusMap from "./pages/CampusMap.jsx";
import Faculty from "./pages/Faculty.jsx";
import Departments from "./pages/Departments.jsx";
import Canteen from "./pages/Canteen.jsx";
import Hostels from "./pages/Hostels.jsx";
import Buses from "./pages/Buses.jsx";
import Events from "./pages/Events.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<CampusMap />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/canteen" element={<Canteen />} />
            <Route path="/hostels" element={<Hostels />} />
            <Route path="/buses" element={<Buses />} />
            <Route path="/events" element={<Events />} />
          </Routes>
        </div>
      </div>
      <ChatWidget />
    </div>
  );
}
