import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, ChevronLeft } from "lucide-react";
import GlobalSearch from "./GlobalSearch.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { NAV_SECTIONS } from "./Sidebar.jsx";

const LABEL_MAP = Object.fromEntries(
  NAV_SECTIONS.flatMap((s) => s.items).map((i) => [i.to, i.label])
);

export default function Navbar({ onMenuClick }) {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Heuristic: climb to the shallowest registered route to show a breadcrumb.
  const parts = pathname.split("/").filter(Boolean);
  let crumbPath = "";
  for (const p of parts) {
    const candidate = "/" + parts.slice(0, parts.indexOf(p) + 1).join("/");
    if (LABEL_MAP[candidate]) crumbPath = candidate;
  }
  const rootMatch = "/" + (parts[0] || "");
  const label = LABEL_MAP[crumbPath] ?? LABEL_MAP[rootMatch] ?? "Home";

  return (
    <header className="topbar">
      <button className="topbar-mobile-menu" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <div className="breadcrumbs">
        <button className="btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "none", cursor: "pointer", color: "inherit", padding: 0 }}>
          <ChevronLeft size={16} />
        </button>
        <span className="breadcrumb-current">{label}</span>
      </div>

      <div className="topbar-search">
        <GlobalSearch />
      </div>

      <div className="topbar-right">
        <button className="icon-btn" onClick={toggle} title="Toggle theme">
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className="btn btn-primary" onClick={() => navigate(pathname === "/map" ? "/" : "/map")}>
          {pathname === "/map" ? "Home" : "Explore Map"}
        </button>
      </div>
    </header>
  );
}