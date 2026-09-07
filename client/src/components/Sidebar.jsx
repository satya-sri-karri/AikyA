import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/map", label: "Campus Map" },
  { to: "/faculty", label: "Faculty" },
  { to: "/departments", label: "Departments" },
  { to: "/canteen", label: "Food & Shops" },
  { to: "/hostels", label: "Hostels" },
  { to: "/buses", label: "Transport" },
  { to: "/events", label: "Events" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">CampusX</div>
      <nav>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
