import { useState, useMemo } from 'react'
import { Search, CheckCircle2, Clock, X, Hash, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { getTodos, getUsers } from '../services/api'

const PURPLE = "#5730e6"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .tasks-root {
    background: #f0f2f5;
    padding: 20px 24px;
    font-family: 'Nunito', 'Segoe UI', sans-serif;
    min-height: 100vh;
  }

  .tasks-topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
  }
  .tasks-page-title { font-size: 18px; font-weight: 900; color: #111827; }
  .tasks-page-sub { font-size: 12px; color: #9ca3af; margin-top: 2px; }

  .tasks-filterbar {
    display: flex; align-items: center; gap: 10px;
    flex-wrap: wrap; margin-bottom: 18px;
  }

  .t-search {
    display: flex; align-items: center; gap: 8px;
    background: white; border: 1.5px solid #e5e7eb;
    border-radius: 11px; padding: 8px 14px;
    flex: 1; min-width: 220px;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .t-search:focus-within {
    border-color: ${PURPLE};
    box-shadow: 0 0 0 3px rgba(87,48,230,0.09);
  }
  .t-search input {
    border: none; background: transparent; outline: none;
    font-size: 13px; font-weight: 600; color: #374151;
    font-family: 'Nunito', inherit; width: 100%;
  }
  .t-search input::placeholder { color: #b0b7c3; font-weight: 500; }

  .filter-group {
    display: flex; align-items: center; gap: 5px;
    background: white; border: 1.5px solid #e5e7eb;
    border-radius: 11px; padding: 5px;
  }
  .filter-pill {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 14px; border-radius: 8px; border: none;
    font-size: 12px; font-weight: 700; cursor: pointer;
    font-family: 'Nunito', inherit;
    transition: all 0.15s; background: transparent; color: #9ca3af;
    white-space: nowrap;
  }
  .filter-pill:hover { background: #f5f3ff; color: ${PURPLE}; }
  .filter-pill.active-all { background: #111827; color: white; }
  .filter-pill.active-done { background: #dcfce7; color: #16a34a; }
  .filter-pill.active-pending { background: #fef9c3; color: #ca8a04; }

  .t-select {
    padding: 8px 32px 8px 14px; border-radius: 11px;
    border: 1.5px solid #e5e7eb; background: white;
    font-size: 12px; font-weight: 700; color: #374151;
    font-family: 'Nunito', inherit; cursor: pointer;
    outline: none; transition: border-color 0.15s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
  }
  .t-select:focus { border-color: ${PURPLE}; box-shadow: 0 0 0 3px rgba(87,48,230,0.09); }

  .tasks-stats {
    display: flex; gap: 10px; margin-bottom: 18px;
  }
  .tasks-stat {
    display: flex; align-items: center; gap: 10px;
    background: white; border-radius: 12px; padding: 12px 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06); flex: 1;
  }
  .tasks-stat-icon {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .tasks-stat-val { font-size: 20px; font-weight: 900; color: #111827; line-height: 1; }
  .tasks-stat-label { font-size: 11px; color: #9ca3af; margin-top: 2px; font-weight: 600; }

  .tasks-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .task-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    border: 1.5px solid transparent;
    cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
    display: flex; flex-direction: column; gap: 14px;
    position: relative; overflow: hidden;
  }
  .task-card::before {
    content: '';
    position: absolute; top: 0; left: 0;
    width: 3px; height: 100%;
    opacity: 0; transition: opacity 0.18s;
    border-radius: 3px 0 0 3px;
  }
  .task-card.done::before { background: linear-gradient(180deg, #22c55e, #86efac); }
  .task-card.pending::before { background: linear-gradient(180deg, #f59e0b, #fde68a); }
  .task-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(87,48,230,0.10);
    border-color: #ede9fe;
  }
  .task-card:hover::before { opacity: 1; }

  .task-user-row {
    display: flex; align-items: center; justify-content: space-between;
  }
  .task-user-info { display: flex; align-items: center; gap: 9px; }
  .task-user-av {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, ${PURPLE}, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 800; color: white;
  }
  .task-user-name { font-size: 13px; font-weight: 800; color: #111827; }
  .task-user-handle { font-size: 11px; color: #9ca3af; margin-top: 1px; }

  .task-title {
    font-size: 14px; font-weight: 800; color: #1f2937;
    line-height: 1.45;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .task-title.done-title { text-decoration: line-through; color: #9ca3af; font-weight: 600; }

  .task-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 12px; border-top: 1px solid #f3f4f6;
  }
  .task-meta-chip {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 700;
  }
  .task-meta-chip.done-chip {
    background: #dcfce7; color: #16a34a;
    border-radius: 99px; padding: 4px 10px;
  }
  .task-meta-chip.pending-chip {
    background: #fef9c3; color: #ca8a04;
    border-radius: 99px; padding: 4px 10px;
  }
  .task-detail-btn {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 700; color: ${PURPLE};
    opacity: 0; transition: opacity 0.15s;
  }
  .task-card:hover .task-detail-btn { opacity: 1; }

  .skeleton {
    background: linear-gradient(90deg, #f3f4f6 25%, #e9eaf0 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite; border-radius: 8px;
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  @media (max-width: 1000px) {
    .tasks-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 700px) {
    .tasks-root { padding: 14px 12px 100px; }
    .tasks-topbar { flex-direction: column; align-items: flex-start; }
    .tasks-filterbar { gap: 8px; }
    .t-search { min-width: 0; }
    .filter-group { width: 100%; justify-content: space-between; }
    .filter-pill { flex: 1; justify-content: center; }
    .tasks-grid { gap: 10px; }
    .task-detail-btn { opacity: 1; }
  }
  @media (max-width: 480px) {
    .tasks-root { padding: 12px 10px 100px; }
    .tasks-stats { gap: 8px; }
    .t-select { width: 100%; }
  }
`

export default function Tasks() {
  const { data: todos, loading: todosLoading, error, retry } = useFetch(getTodos)
  const { data: users } = useFetch(getUsers)
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [filterUser, setFilterUser] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const getUserById = (id) => users?.find((u) => u.id === id)

  const filtered = useMemo(() => {
    if (!todos) return []
    return todos.filter((t) => {
      const user = getUserById(t.userId)
      const matchTitle = t.title.toLowerCase().includes(search.toLowerCase())
      const matchName = user?.name?.toLowerCase().includes(search.toLowerCase())
      const matchSearch = matchTitle || matchName
      const matchUser = filterUser === 'all' || t.userId === parseInt(filterUser)
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'completed' && t.completed) ||
        (filterStatus === 'pending' && !t.completed)
      return matchSearch && matchUser && matchStatus
    })
  }, [todos, users, search, filterUser, filterStatus])

  const totalCount = todos?.length ?? 0
  const completedCount = useMemo(() => todos?.filter(t => t.completed).length ?? 0, [todos])
  const pendingCount = totalCount - completedCount

  return (
    <>
      <style>{css}</style>
      <div className="tasks-root">

        <div className="tasks-topbar">
          <div>
            <div className="tasks-page-title">Tasks</div>
            <div className="tasks-page-sub">{filtered.length} tasks found</div>
          </div>
        </div>

        {!todosLoading && (
          <div className="tasks-stats">
            <div className="tasks-stat">
              <div className="tasks-stat-icon" style={{ background: '#f0ecff' }}>
                <Hash size={16} color={PURPLE} />
              </div>
              <div>
                <div className="tasks-stat-val">{totalCount}</div>
                <div className="tasks-stat-label">Total</div>
              </div>
            </div>
            <div className="tasks-stat">
              <div className="tasks-stat-icon" style={{ background: '#dcfce7' }}>
                <CheckCircle2 size={16} color="#16a34a" />
              </div>
              <div>
                <div className="tasks-stat-val" style={{ color: '#16a34a' }}>{completedCount}</div>
                <div className="tasks-stat-label">Completed</div>
              </div>
            </div>
            <div className="tasks-stat">
              <div className="tasks-stat-icon" style={{ background: '#fef9c3' }}>
                <Clock size={16} color="#ca8a04" />
              </div>
              <div>
                <div className="tasks-stat-val" style={{ color: '#ca8a04' }}>{pendingCount}</div>
                <div className="tasks-stat-label">Pending</div>
              </div>
            </div>
          </div>
        )}

        <div className="tasks-filterbar">
          <div className="t-search">
            <Search size={14} color="#b0b7c3" />
            <input
              placeholder="Search by task or user name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <X size={13} color="#9ca3af" style={{ cursor: 'pointer', flexShrink: 0 }}
                onClick={() => setSearch('')} />
            )}
          </div>

          <div className="filter-group">
            {[
              { val: 'all',       label: 'All',     cls: 'active-all',     icon: <Hash size={12} /> },
              { val: 'completed', label: 'Done',    cls: 'active-done',    icon: <CheckCircle2 size={12} /> },
              { val: 'pending',   label: 'Pending', cls: 'active-pending', icon: <Clock size={12} /> },
            ].map(f => (
              <button
                key={f.val}
                className={`filter-pill ${filterStatus === f.val ? f.cls : ''}`}
                onClick={() => setFilterStatus(f.val)}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          <select className="t-select" value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
            <option value="all">All Users</option>
            {users?.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        {error && (
  <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: 10, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
    <span>{error}</span>
    <button onClick={retry} style={{ background: 'transparent', border: '1.5px solid #dc2626', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#dc2626', fontFamily: 'Nunito, inherit', whiteSpace: 'nowrap' }}>
      Try Again
    </button>
  </div>
)}

        <div className="tasks-grid">
          {todosLoading
            ? Array(8).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 170, borderRadius: 16 }} />
              ))
            : filtered.length > 0
              ? filtered.map((task) => {
                  const user = getUserById(task.userId)
                  return (
                    <div
                      key={task.id}
                      className={`task-card ${task.completed ? 'done' : 'pending'}`}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      <div className="task-user-row">
                        <div className="task-user-info">
                          <div className="task-user-av">{user?.name?.[0] ?? 'U'}</div>
                          <div>
                            <div className="task-user-name">{user?.name?.split(' ')[0] ?? `User ${task.userId}`}</div>
                            <div className="task-user-handle">@{user?.username ?? `user${task.userId}`}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#d1d5db', background: '#f9fafb', borderRadius: 7, padding: '3px 9px' }}>
                          #{task.id}
                        </span>
                      </div>

                      <div className={`task-title${task.completed ? ' done-title' : ''}`}>
                        {task.title}
                      </div>

                      <div className="task-card-footer">
                        {task.completed
                          ? <div className="task-meta-chip done-chip">
                              <CheckCircle2 size={12} /> Completed
                            </div>
                          : <div className="task-meta-chip pending-chip">
                              <Clock size={12} /> Pending
                            </div>
                        }
                        <div className="task-detail-btn">
                          View detail <ChevronRight size={12} />
                        </div>
                      </div>
                    </div>
                  )
                })
              : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: 13, fontWeight: 600 }}>
                  No tasks found
                </div>
              )
          }
        </div>
      </div>
    </>
  )
}