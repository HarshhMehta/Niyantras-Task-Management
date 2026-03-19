import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Globe, Building2, MapPin, CheckCircle2, Clock } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import { getUserById, getTodos } from '../services/api'

const PURPLE = "#5730e6"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .ud-root {
    padding: 20px 24px;
    font-family: 'Nunito', 'Segoe UI', sans-serif;
    min-height: 100vh;
  }

  .ud-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700; color: #6b7280;
    background: white; border: 1.5px solid #e5e7eb;
    border-radius: 10px; padding: 7px 14px;
    cursor: pointer; text-decoration: none; margin-bottom: 18px;
    transition: all 0.15s; font-family: 'Nunito', inherit;
    border: none;
  }
  .ud-back:hover { background: #f5f3ff; color: ${PURPLE}; }

  .ud-grid {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 16px;
    align-items: start;
  }

  /* Left: User info card */
  .ud-info-card {
    background: white; border-radius: 16px; padding: 22px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  }

  .ud-avatar-wrap { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
  .ud-avatar {
    width: 56px; height: 56px; border-radius: 16px; flex-shrink: 0;
    background: linear-gradient(135deg, ${PURPLE}, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 800; color: white;
  }
  .ud-name { font-size: 16px; font-weight: 900; color: #111827; }
  .ud-username { font-size: 12px; color: #9ca3af; margin-top: 2px; }

  .ud-info-list { display: flex; flex-direction: column; gap: 12px; }
  .ud-info-row {
    display: flex; align-items: center; gap: 10px;
    font-size: 12px; color: #6b7280; font-weight: 600;
  }
  .ud-info-row span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ud-info-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: #f0ecff; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0; color: ${PURPLE};
  }

  /* Right: Stats + tasks */
  .ud-right { display: flex; flex-direction: column; gap: 14px; }

  .ud-stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  }
  .ud-stat-card {
    background: white; border-radius: 14px; padding: 16px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    text-align: center;
  }
  .ud-stat-val { font-size: 28px; font-weight: 900; letter-spacing: -1px; line-height: 1; margin-bottom: 6px; }
  .ud-stat-label { font-size: 11px; color: #9ca3af; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 4px; }

  .ud-tasks-card {
    background: white; border-radius: 16px; padding: 18px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  }
  .ud-tasks-title { font-size: 13px; font-weight: 800; color: #1f2937; margin-bottom: 14px; }

  .ud-task-row {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 8px; border-radius: 8px; border-bottom: 1px solid #f9fafb;
    cursor: default; transition: background 0.12s;
  }
  .ud-task-row:last-child { border-bottom: none; }
  .ud-task-row:hover { background: #faf9ff; }
  .ud-task-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .ud-task-title { font-size: 12px; font-weight: 600; color: #374151; flex: 1; }
  .ud-task-title.done { text-decoration: line-through; color: #9ca3af; }
  .ud-task-badge-done { font-size: 10px; background: #dcfce7; color: #16a34a; border-radius: 99px; padding: 2px 8px; font-weight: 700; }
  .ud-task-badge-pending { font-size: 10px; background: #fef9c3; color: #ca8a04; border-radius: 99px; padding: 2px 8px; font-weight: 700; }

  /* Skeleton */
  .skeleton {
    background: linear-gradient(90deg, #f3f4f6 25%, #e9eaf0 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite; border-radius: 8px;
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  @media (max-width: 900px) {
    .ud-grid { grid-template-columns: 1fr; }
    .ud-stats-row { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 700px) {
    .ud-root { padding: 14px 12px 100px; }
  }
  @media (max-width: 480px) {
    .ud-root { padding: 12px 10px 100px; }
    .ud-stats-row { grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .ud-stat-val { font-size: 22px; }
    .ud-stat-card { padding: 12px; }
  }
`

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: user, loading: userLoading, error, retry } = useFetch(() => getUserById(id), [id])
  const { data: todos, loading: todosLoading } = useFetch(getTodos)

  const userTodos = useMemo(() => todos?.filter((t) => t.userId === parseInt(id)) || [], [todos, id])
  const completed = userTodos.filter((t) => t.completed).length
  const pending = userTodos.length - completed

  if (userLoading) return (
    <>
      <style>{css}</style>
      <div className="ud-root">
        <div className="skeleton" style={{ height: 40, width: 120, borderRadius: 10, marginBottom: 18 }} />
        <div className="ud-grid">
          <div className="skeleton" style={{ height: 320, borderRadius: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="skeleton" style={{ height: 90, borderRadius: 14 }} />
            <div className="skeleton" style={{ height: 280, borderRadius: 16 }} />
          </div>
        </div>
      </div>
    </>
  )

  if (error) return (
    <>
      <style>{css}</style>
      <div className="ud-root">
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: 10, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span>{error}</span>
          <button onClick={retry} style={{ background: 'transparent', border: '1.5px solid #dc2626', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#dc2626', fontFamily: 'Nunito, inherit', whiteSpace: 'nowrap' }}>
            Try Again
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{css}</style>
      <div className="ud-root">

        <button className="ud-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back to Users
        </button>

        <div className="ud-grid">

          {/* Left: User info */}
          <div className="ud-info-card">
            <div className="ud-avatar-wrap">
              <div className="ud-avatar">{user?.name?.[0]}</div>
              <div>
                <div className="ud-name">{user?.name}</div>
                <div className="ud-username">@{user?.username}</div>
              </div>
            </div>
            <div className="ud-info-list">
              {[
                { icon: <Mail size={13} />, val: user?.email },
                { icon: <Phone size={13} />, val: user?.phone },
                { icon: <Globe size={13} />, val: user?.website },
                { icon: <Building2 size={13} />, val: user?.company?.name },
                { icon: <MapPin size={13} />, val: `${user?.address?.street}, ${user?.address?.city}` },
              ].map((item, i) => (
                <div key={i} className="ud-info-row">
                  <div className="ud-info-icon">{item.icon}</div>
                  <span>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="ud-right">

            {/* Stat cards */}
            <div className="ud-stats-row">
              <div className="ud-stat-card">
                <div className="ud-stat-val" style={{ color: '#111827' }}>{userTodos.length}</div>
                <div className="ud-stat-label">Total Tasks</div>
              </div>
              <div className="ud-stat-card">
                <div className="ud-stat-val" style={{ color: '#16a34a' }}>{completed}</div>
                <div className="ud-stat-label"><CheckCircle2 size={11} color="#22c55e" /> Completed</div>
              </div>
              <div className="ud-stat-card">
                <div className="ud-stat-val" style={{ color: '#ca8a04' }}>{pending}</div>
                <div className="ud-stat-label"><Clock size={11} color="#f59e0b" /> Pending</div>
              </div>
            </div>

            {/* Tasks list */}
            <div className="ud-tasks-card">
              <div className="ud-tasks-title">Recent Tasks</div>
              {todosLoading
                ? Array(6).fill(0).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 36, marginBottom: 6, borderRadius: 8 }} />
                  ))
                : userTodos.slice(0, 10).map((todo) => (
                    <div key={todo.id} className="ud-task-row">
                      <div
                        className="ud-task-dot"
                        style={{ background: todo.completed ? '#22c55e' : '#f59e0b' }}
                      />
                      <span className={`ud-task-title${todo.completed ? ' done' : ''}`}>
                        {todo.title}
                      </span>
                      {todo.completed
                        ? <span className="ud-task-badge-done">Done</span>
                        : <span className="ud-task-badge-pending">Pending</span>
                      }
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}