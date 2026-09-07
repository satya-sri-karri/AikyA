import { NavLink, Link } from "react-router-dom";
import {
  Home, Map, Users, Building2, UtensilsCrossed, Bus, Hotel, CalendarDays, ShieldCheck, PanelsLeftBottom,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { to: "/", label: "Home", icon: Home, end: true },
      { to: "/map", label: "Explore", icon: Map },
      { to: "/faculty", label: "People", icon: Users },
      { to: "/departments", label: "Departments", icon: Building2 },
    ],
  },
  {
    label: "Campus",
    items: [
      { to: "/canteen", label: "Food", icon: UtensilsCrossed },
      { to: "/buses", label: "Transit", icon: Bus },
      { to: "/hostels", label: "Hostels", icon: Hotel },
      { to: "/events", label: "Events", icon: CalendarDays },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin", label: "Admin", icon: ShieldCheck },
    ],
  },
];

export const MOBILE_NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/map", label: "Explore", icon: Map },
  { to: "/canteen", label: "Food", icon: UtensilsCrossed },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
];

export function SidebarLinks() {
  return NAV_SECTIONS.flatMap((s, si) => [
    <div key={`label-${si}`} className="sidebar-section-label">{s.label}</div>,
    ...s.items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        data-tip={item.label}
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
      >
        <span className="sl-icon"><item.icon size={19} strokeWidth={2.1} /></span>
        <span className="sl-label">{item.label}</span>
      </NavLink>
    )),
  ]);
}

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
        <Link to="/" className="sidebar-logo">
          <span className="sidebar-logo-mark">✦</span>
          <span className="sidebar-logo-text">AIKYA</span>
        </Link>

        <nav className="sidebar-nav">
          <SidebarLinks />
        </nav>

        <div className="sidebar-footer">
          <button
            className="icon-btn sidebar-toggle-desktop"
            onClick={onToggleCollapse}
            title="Collapse sidebar"
          >
            <PanelsLeftBottom size={16} />
          </button>
          <span className="micro">ONE CAMPUS · CONNECTED</span>
        </div>
      </aside>

      {/* Mobile slide-out drawer */}
      <div className={`mobile-drawer${mobileOpen ? " open" : ""}`}>
        <div className="mobile-drawer-backdrop" onClick={onMobileClose} />
        <div className="mobile-drawer-panel">
          <Link to="/" className="sidebar-logo" onClick={onMobileClose}>
            <span className="sidebar-logo-mark">✦</span>
            <span className="sidebar-logo-text">AIKYA</span>
          </Link>
          {(<SidebarLinks />)}
        </div>
      </div>
    </>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {MOBILE_NAV.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? "active" : "")}>
          <span className="bn-icon"><item.icon size={18} strokeWidth={2.2} /></span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}