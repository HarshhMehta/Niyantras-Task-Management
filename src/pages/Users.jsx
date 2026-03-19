import { useState } from 'react'
import { Search, Mail, Phone, Globe, Building2, MapPin, X, ChevronRight } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import { getUsers } from '../services/api'
import { useNavigate } from 'react-router-dom'

const PURPLE = "#5730e6"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .users-root {
    background: #f0f2f5;
    padding: 20px 24px;
    font-family: 'Nunito', 'Segoe UI', sans-serif;
    min-height: 100vh;
  }

  .users-topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
  }
  .users-page-title { font-size: 18px; font-weight: 900; color: #111827; }
  .users-page-sub { font-size: 12px; color: #9ca3af; margin-top: 2px; }

  .u-search {
    display: flex; align-items: center; gap: 8px;
    background: white; border: 1.5px solid #e5e7eb;
    border-radius: 11px; padding: 8px 14px;
    min-width: 260px;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .u-search:focus-within {
    border-color: ${PURPLE};
    box-shadow: 0 0 0 3px rgba(87,48,230,0.09);
  }
  .u-search input {
    border: none; background: transparent; outline: none;
    font-size: 13px; font-weight: 600; color: #374151;
    font-family: 'Nunito', inherit; width: 100%;
  }
  .u-search input::placeholder { color: #b0b7c3; font-weight: 500; }

  .users-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  .user-card {
    background: white; border-radius: 16px; padding: 18px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    cursor: pointer; border: 1.5px solid transparent;
    transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
    display: flex; flex-direction: column; gap: 14px;
  }
  .user-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(0,0,0,0.10);
    border-color: #ede9fe;
  }

  .user-card-header { display: flex; align-items: center; gap: 12px; }
  .user-av-lg {
    width: 46px; height: 46px; border-radius: 14px; flex-shrink: 0;
    background: linear-gradient(135deg, ${PURPLE}, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 800; color: white;
  }
  .user-card-name { font-size: 14px; font-weight: 800; color: #111827; }
  .user-card-username { font-size: 11px; color: #9ca3af; margin-top: 2px; }

  .user-card-info {
    display: flex; flex-direction: column; gap: 7px;
    padding-top: 12px; border-top: 1px solid #f3f4f6;
  }
  .user-info-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 11px; color: #6b7280; font-weight: 600;
  }
  .user-info-row span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .user-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 10px; border-top: 1px solid #f3f4f6;
  }
  .user-view-btn {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 700; color: ${PURPLE};
    background: #f0ecff; border-radius: 8px; padding: 5px 10px;
    border: none; cursor: pointer; font-family: 'Nunito', inherit;
    transition: background 0.15s;
  }
  .user-view-btn:hover { background: #ede9fe; }
  .user-company { font-size: 11px; color: #9ca3af; display: flex; align-items: center; gap: 4px; }

  /* Skeleton */
  .skeleton {
    background: linear-gradient(90deg, #f3f4f6 25%, #e9eaf0 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite; border-radius: 8px;
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  @media (max-width: 1000px) {
    .users-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 700px) {
    .users-root { padding: 14px 12px 100px; }
    .users-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .users-topbar { flex-direction: column; align-items: flex-start; }
    .u-search { min-width: 0; width: 100%; }
  }
  @media (max-width: 480px) {
    .users-root { padding: 12px 10px 100px; }
    .users-grid { grid-template-columns: 1fr; }
  }
`

export default function Users() {
  const { data: users, loading, error, retry } = useFetch(getUsers)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = users?.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{css}</style>
      <div className="users-root">

        <div className="users-topbar">
          <div>
            <div className="users-page-title">Users</div>
            <div className="users-page-sub">{filtered?.length ?? 0} users found</div>
          </div>
          <div className="u-search">
            <Search size={14} color="#b0b7c3" />
            <input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <X size={13} color="#9ca3af" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => setSearch('')} />
            )}
          </div>
        </div>

        {error && (
  <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: 10, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
    <span>{error}</span>
    <button onClick={retry} style={{ background: 'transparent', border: '1.5px solid #dc2626', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#dc2626', fontFamily: 'Nunito, inherit', whiteSpace: 'nowrap' }}>
      Try Again
    </button>
  </div>
)}

        <div className="users-grid">
          {loading
            ? Array(6).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
              ))
            : filtered?.length > 0
              ? filtered.map((user) => (
                  <div key={user.id} className="user-card" onClick={() => navigate(`/users/${user.id}`)}>
                    <div className="user-card-header">
                      <div className="user-av-lg">{user.name[0]}</div>
                      <div>
                        <div className="user-card-name">{user.name}</div>
                        <div className="user-card-username">@{user.username}</div>
                      </div>
                    </div>
                    <div className="user-card-info">
                      <div className="user-info-row">
                        <Mail size={12} color="#a78bfa" style={{ flexShrink: 0 }} />
                        <span>{user.email}</span>
                      </div>
                      <div className="user-info-row">
                        <Phone size={12} color="#a78bfa" style={{ flexShrink: 0 }} />
                        <span>{user.phone}</span>
                      </div>
                      <div className="user-info-row">
                        <MapPin size={12} color="#a78bfa" style={{ flexShrink: 0 }} />
                        <span>{user.address?.city}</span>
                      </div>
                    </div>
                    <div className="user-card-footer">
                      <div className="user-company">
                        <Building2 size={11} />
                        {user.company?.name}
                      </div>
                      <button className="user-view-btn">
                        View <ChevronRight size={11} />
                      </button>
                    </div>
                  </div>
                ))
              : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: 13, fontWeight: 600 }}>
                  No users found
                </div>
              )
          }
        </div>
      </div>
    </>
  )
}