import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  FileText,
} from "lucide-react";

const PURPLE = "#5730e6";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/users", label: "Users", icon: Users },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/posts", label: "Posts", icon: FileText },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .mob-nav { display: none; }

  @media (max-width: 700px) {
    .mob-nav {
      display: flex;
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 40px);
      max-width: 400px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 28px;
      border: 1.5px solid rgba(87, 48, 230, 0.15);
      box-shadow:
        0 4px 24px rgba(87, 48, 230, 0.15),
        0 1px 4px rgba(0,0,0,0.06),
        inset 0 1px 0 rgba(255,255,255,0.9);
      padding: 8px 12px;
      z-index: 1000;
      align-items: center;
      justify-content: space-around;
      font-family: 'Nunito', sans-serif;
    }

    .mob-nav-spacer { height: 96px; }
  }

  @media (min-width: 701px) {
    .mob-nav-spacer { display: none; }
  }

  .mob-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    flex: 1;
    padding: 6px 4px;
    border-radius: 18px;
    text-decoration: none;
    color: #b0b8c9;
    transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
  }

  .mob-nav-item.active { color: ${PURPLE}; }

  .mob-nav-icon-wrap {
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 16px;
    transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
    color: #b0b8c9;
  }

  .mob-nav-item.active .mob-nav-icon-wrap {
    background: linear-gradient(135deg, ${PURPLE}, #7c5cf6);
    box-shadow: 0 4px 14px rgba(87,48,230,0.35);
    transform: translateY(-4px);
    color: white;
  }

  .mob-nav-item:not(.active):hover .mob-nav-icon-wrap {
    background: #f0ecff;
    color: ${PURPLE};
  }

  .mob-nav-label {
    font-size: 10px;
    font-weight: 600;
    line-height: 1;
    color: #b0b8c9;
    transition: all 0.15s;
  }

  .mob-nav-item.active .mob-nav-label {
    font-weight: 800;
    color: ${PURPLE};
  }

  .mob-nav-item.active::after {
    content: '';
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px; height: 4px;
    border-radius: 50%;
    background: ${PURPLE};
  }
`;

export default function MobileNav() {
  return (
    <>
      <style>{css}</style>
      <nav className="mob-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `mob-nav-item${isActive ? " active" : ""}`}
            >
              {({ isActive }) => (
                <>
                  <div className="mob-nav-icon-wrap">
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      color={isActive ? "white" : undefined}
                    />
                  </div>
                  <span className="mob-nav-label">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="mob-nav-spacer" />
    </>
  );
}