import { Search, Command, Bell, UserPlus, SlidersHorizontal, Plus } from "lucide-react";

const PURPLE = "#5730e6";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .header {
    background: white;
    display: flex;
    align-items: center;
    padding: 12px 28px;
    border-bottom: 1px solid #f0f0f0;
    gap: 12px;
    position: sticky;
    top: 0;
    z-index: 10;
    font-family: 'Nunito', 'Segoe UI', sans-serif;
  }

  .header-title { flex: 1; min-width: 0; }
  .header-title h1 { font-size: 20px; font-weight: 800; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .header-title p { font-size: 12px; color: #9ca3af; margin-top: 2px; }

  .header-search {
    display: flex; align-items: center; gap: 10px;
    background: #f9fafb; border: 1.5px solid #e5e7eb;
    border-radius: 11px; padding: 9px 16px;
    min-width: 240px;
    transition: border-color 0.18s, box-shadow 0.18s;
    font-family: 'Nunito', 'Segoe UI', sans-serif;
  }
  .header-search:focus-within {
    border-color: ${PURPLE};
    box-shadow: 0 0 0 3px rgba(87,48,230,0.09);
  }
  .header-search input {
    border: none; background: transparent; outline: none;
    font-size: 13px; font-weight: 600; color: #374151;
    font-family: 'Nunito', 'Segoe UI', sans-serif;
    width: 160px;
  }
  .header-search input::placeholder { color: #b0b7c3; font-weight: 500; }

  .header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  .icon-btn {
    width: 36px; height: 36px; border-radius: 10px;
    background: #f9fafb; border: 1.5px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s; position: relative;
    color: #6b7280; flex-shrink: 0;
  }
  .icon-btn:hover { border-color: ${PURPLE}; color: ${PURPLE}; background: #f5f3ff; }
  .icon-btn .notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 7px; height: 7px; border-radius: 50%;
    background: #ef4444; border: 1.5px solid white;
  }

  .btn-outline {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 10px;
    border: 1.5px solid #e5e7eb; background: white;
    font-size: 12px; font-weight: 700; color: #374151;
    cursor: pointer; font-family: 'Nunito', inherit;
    transition: all 0.15s; white-space: nowrap;
  }
  .btn-outline:hover { border-color: ${PURPLE}; color: ${PURPLE}; background: #f5f3ff; }

  .btn-primary {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 10px;
    background: ${PURPLE}; color: white;
    font-size: 12px; font-weight: 700; border: none;
    cursor: pointer; font-family: 'Nunito', inherit;
    box-shadow: 0 4px 14px rgba(87,48,230,0.28);
    transition: opacity 0.15s; white-space: nowrap;
  }
  .btn-primary:hover { opacity: 0.88; }

  /* Tablet ≤900px — hide Invite & Filters text buttons */
  @media (max-width: 900px) {
    .header { padding: 10px 16px; }
    .header-search { min-width: 180px; }
    .header-search input { width: 110px; }
    .btn-hide { display: none; }
  }

  /* Mobile large ≤700px — search stretches, title shrinks */
  @media (max-width: 700px) {
    .header { padding: 10px 14px; gap: 8px; }
    .header-title h1 { font-size: 16px; }
    .header-title p { display: none; }
    .header-search { min-width: 0; flex: 1; padding: 8px 12px; }
    .header-search input { width: 100%; min-width: 0; }
    /* hide command button on mobile */
    .cmd-hide { display: none; }
  }

  /* Mobile small ≤480px — hide search bar, show search icon only */
  @media (max-width: 480px) {
    .header-title h1 { font-size: 15px; }
    .header-search { display: none; }
    .search-icon-btn { display: flex !important; }
    /* show only bell + search icon + new task */
    .btn-primary span { display: none; }
    .btn-primary { padding: 8px 10px; }
  }

  /* Always hidden on large, shown on small */
  .search-icon-btn { display: none; }
`;

export default function Header() {
  return (
    <>
      <style>{css}</style>
      <header className="header">
        <div className="header-title">
          <h1>Welcome Back, Harsh</h1>
          <p>Ready to conquer your Tasks?</p>
        </div>

        {/* Search bar — hidden on ≤480px */}
        <div className="header-search">
          <Search size={15} color="#b0b7c3" />
          <input placeholder="Search anything..." />
        </div>

        <div className="header-right">
          {/* Search icon — only on ≤480px */}
          <div className="icon-btn search-icon-btn">
            <Search size={15} />
          </div>

          {/* Command — hidden on mobile */}
          <div className="icon-btn cmd-hide">
            <Command size={15} />
          </div>

          {/* Bell — always visible */}
          <div className="icon-btn">
            <Bell size={15} />
            <span className="notif-dot" />
          </div>

          {/* Invite & Filters — hidden on ≤900px */}
          <button className="btn-outline btn-hide">
            <UserPlus size={13} /> Invite
          </button>
          <button className="btn-outline btn-hide">
            <SlidersHorizontal size={13} /> Filters
          </button>

          {/* New Task — always visible, text hidden on ≤480px */}
          <button className="btn-primary">
            <Plus size={14} />
            <span>New Task</span>
          </button>
        </div>
      </header>
    </>
  );
}