import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  FileText,
  Settings,
  LogOut,
  Activity,
} from "lucide-react";

const PURPLE = "#5730e6";

const navItems = [
  { to: "/", label: "Dashboard", icon: <LayoutDashboard size={16} />, end: true },
  { to: "/users", label: "Users", icon: <Users size={16} /> },
  { to: "/tasks", label: "Tasks", icon: <CheckSquare size={16} /> },
  { to: "/posts", label: "Posts", icon: <FileText size={16} /> },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .sb-root {
    width: 220px;
    min-width: 220px;
    background: white;
    display: flex;
    flex-direction: column;
    padding: 0 0 16px 0;
    border-right: 1px solid #f0f0f0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    font-family: 'Nunito', 'Segoe UI', sans-serif;
  }

  /* Hide sidebar on mobile */
  @media (max-width: 700px) {
    .sb-root { display: none; }
  }

  .sb-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 18px 18px 16px;
    border-bottom: 1px solid #f5f5f5;
  }
  .sb-logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, ${PURPLE}, #a78bfa);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; color: white; font-weight: 900;
    flex-shrink: 0;
  }
  .sb-logo-text { font-size: 13px; font-weight: 800; color: #111827; line-height: 1.2; }
  .sb-logo-sub { font-size: 10px; color: #9ca3af; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; }

  .sb-section-label {
    font-size: 10px; font-weight: 700; color: #d1d5db;
    letter-spacing: 1px; text-transform: uppercase;
    padding: 14px 18px 6px;
  }

  .sb-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 18px;
    font-size: 13px; font-weight: 600; color: #6b7280;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
    position: relative;
  }
  .sb-nav-item:hover {
    color: ${PURPLE};
    background: #f5f3ff;
  }
  .sb-nav-item.active {
    color: ${PURPLE};
    background: #f5f3ff;
    border-right: 3px solid ${PURPLE};
  }
  .sb-nav-icon {
    width: 20px; text-align: center; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }

  .sb-bottom {
    margin-top: auto;
    border-top: 1px solid #f5f5f5;
    padding-top: 12px;
  }
  .sb-user {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 18px; cursor: pointer;
  }
  .sb-user-av {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, ${PURPLE}, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; color: white; font-weight: 700; flex-shrink: 0;
  }
  .sb-user-name { font-size: 12px; font-weight: 700; color: #111827; }
  .sb-user-role { font-size: 10px; color: #9ca3af; }
`;

export default function Sidebar() {
  return (
    <>
      <style>{css}</style>
      <aside className="sb-root">
        {/* Logo */}
        <div className="sb-logo">
          <div className="sb-logo-icon">A</div>
          <div>
            <div className="sb-logo-text">ADMIN</div>
            <div className="sb-logo-sub">Dashboard</div>
          </div>
        </div>

        {/* General Nav */}
        <div className="sb-section-label">General</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sb-nav-item${isActive ? " active" : ""}`}
          >
            <span className="sb-nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {/* Bottom */}
        <div className="sb-bottom">
          <NavLink
            to="/activity"
            className={({ isActive }) => `sb-nav-item${isActive ? " active" : ""}`}
          >
            <span className="sb-nav-icon"><Activity size={16} /></span>
            Activity Log
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => `sb-nav-item${isActive ? " active" : ""}`}
          >
            <span className="sb-nav-icon"><Settings size={16} /></span>
            Settings
          </NavLink>

          <div className="sb-user">
            <div className="sb-user-av">H</div>
            <div>
              <div className="sb-user-name">Harsh</div>
              <div className="sb-user-role">Admin</div>
            </div>
          </div>

    
        </div>
      </aside>
    </>
  );
}