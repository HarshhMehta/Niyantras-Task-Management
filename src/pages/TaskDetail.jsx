import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock, User, Hash, Mail, Phone, Globe, Building2 } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import { getTodos, getUsers } from '../services/api'
import { useMemo } from 'react'

const PURPLE = "#5730e6"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .td-root {
    background: #f0f2f5;
    padding: 20px 24px;
    font-family: 'Nunito', 'Segoe UI', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
  }

  .td-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700; color: #6b7280;
    background: white; border: none;
    border-radius: 10px; padding: 8px 14px;
    cursor: pointer; margin-bottom: 20px;
    font-family: 'Nunito', inherit;
    transition: all 0.15s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .td-back:hover { background: #f5f3ff; color: ${PURPLE}; }

  /* Desktop: task left, user right */
  .td-grid {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 16px;
    align-items: start;
    width: 100%;
    box-sizing: border-box;
  }

  .td-panel {
    background: white; border-radius: 16px; padding: 22px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    min-width: 0; width: 100%; box-sizing: border-box;
    overflow: hidden;
  }

  .td-status-bar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; flex-wrap: wrap; gap: 10px;
  }
  .td-badge-done {
    display: inline-flex; align-items: center; gap: 6px;
    background: #dcfce7; color: #16a34a;
    border-radius: 99px; padding: 6px 16px;
    font-size: 13px; font-weight: 700;
  }
  .td-badge-pending {
    display: inline-flex; align-items: center; gap: 6px;
    background: #fef9c3; color: #ca8a04;
    border-radius: 99px; padding: 6px 16px;
    font-size: 13px; font-weight: 700;
  }
  .td-id-badge {
    font-size: 12px; font-weight: 700; color: #9ca3af;
    background: #f3f4f6; border-radius: 8px; padding: 5px 12px;
    display: inline-flex; align-items: center; gap: 5px;
  }

  .td-task-title {
    font-size: 20px; font-weight: 900; color: #111827;
    line-height: 1.4; margin-bottom: 24px;
    text-transform: capitalize;
    word-break: break-word;
  }
  .td-task-title.done { text-decoration: line-through; color: #9ca3af; }

  .td-divider { height: 1px; background: #f3f4f6; margin: 20px 0; }

  .td-meta-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  }
  .td-meta-item {
    background: #faf9ff; border-radius: 12px; padding: 14px;
    border: 1px solid #ede9fe;
    min-width: 0;
  }
  .td-meta-label {
    font-size: 10px; font-weight: 700; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;
    display: flex; align-items: center; gap: 5px;
  }
  .td-meta-val {
    font-size: 14px; font-weight: 800; color: #111827;
    word-break: break-word;
  }

  /* User panel */
  .td-user-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
  }
  .td-user-av {
    width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
    background: linear-gradient(135deg, ${PURPLE}, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 800; color: white;
  }
  .td-user-name {
    font-size: 16px; font-weight: 900; color: #111827;
    word-break: break-word;
  }
  .td-user-handle { font-size: 12px; color: #9ca3af; margin-top: 2px; }

  .td-user-info { display: flex; flex-direction: column; gap: 10px; }
  .td-user-row {
    display: flex; align-items: center; gap: 10px;
    font-size: 12px; color: #6b7280; font-weight: 600;
    min-width: 0;
  }
  .td-user-icon {
    width: 28px; height: 28px; border-radius: 8px; background: #f0ecff;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: ${PURPLE};
  }
  .td-user-row span {
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    min-width: 0; flex: 1;
  }

  .td-profile-btn {
    margin-top: 16px; width: 100%; padding: 9px;
    background: #f0ecff; color: ${PURPLE}; border: none;
    border-radius: 10px; font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', inherit;
    transition: background 0.15s;
    box-sizing: border-box;
  }
  .td-profile-btn:hover { background: #ede9fe; }

  /* Other tasks */
  .td-panel-title {
    font-size: 13px; font-weight: 800; color: #1f2937; margin-bottom: 14px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .td-panel-badge {
    font-size: 10px; color: #6b7280; border: 1.5px solid #e5e7eb;
    border-radius: 7px; padding: 2px 9px; font-weight: 600;
  }
  .td-other-task {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 8px; border-radius: 8px;
    border-bottom: 1px solid #f9fafb;
    cursor: pointer; transition: background 0.12s;
    min-width: 0;
  }
  .td-other-task:last-child { border-bottom: none; }
  .td-other-task:hover { background: #faf9ff; }
  .td-other-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .td-other-title {
    font-size: 12px; font-weight: 600; color: #374151; flex: 1;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    min-width: 0;
  }
  .td-other-title.done { text-decoration: line-through; color: #9ca3af; }

  /* Skeleton */
  .skeleton {
    background: linear-gradient(90deg, #f3f4f6 25%, #e9eaf0 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite; border-radius: 8px;
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* ── Responsive ── */

  /* Tablet ≤900px — stack columns */
  @media (max-width: 900px) {
    .td-grid { grid-template-columns: 1fr; }
  }

  /* Mobile ≤700px */
  @media (max-width: 700px) {
    .td-root { padding: 14px 12px 100px; }
    .td-task-title { font-size: 17px; }
    .td-panel { padding: 16px; }
    .td-grid { grid-template-columns: 1fr; }
  }

  /* Mobile small ≤480px */
  @media (max-width: 480px) {
    .td-root { padding: 12px 10px 100px; }
    .td-task-title { font-size: 15px; margin-bottom: 16px; }
    .td-meta-grid { grid-template-columns: 1fr; }
    .td-panel { padding: 14px; }
    .td-grid { grid-template-columns: 1fr; }
    .td-user-av { width: 42px; height: 42px; font-size: 16px; }
    .td-user-name { font-size: 14px; }
    .td-badge-done, .td-badge-pending { font-size: 11px; padding: 5px 12px; }
    .td-id-badge { font-size: 11px; }
    .td-status-bar { gap: 8px; }
    .td-user-row span { font-size: 11px; }
  }
`

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: todos, loading: todosLoading } = useFetch(getTodos)
  const { data: users, loading: usersLoading } = useFetch(getUsers)

  const loading = todosLoading || usersLoading

  const task = useMemo(() => todos?.find(t => t.id === parseInt(id)), [todos, id])
  const user = useMemo(() => users?.find(u => u.id === task?.userId), [users, task])

  const otherTasks = useMemo(() =>
    todos?.filter(t => t.userId === task?.userId && t.id !== task?.id).slice(0, 6) ?? []
  , [todos, task])

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="td-root">
        <div className="skeleton" style={{ height: 36, width: 120, borderRadius: 10, marginBottom: 20 }} />
        <div className="td-grid">
          <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
            <div className="skeleton" style={{ height: 180, borderRadius: 16 }} />
          </div>
        </div>
      </div>
    </>
  )

  if (!task) return (
    <>
      <style>{css}</style>
      <div className="td-root">
        <button className="td-back" onClick={() => navigate('/tasks')}>
          <ArrowLeft size={14} /> Back to Tasks
        </button>
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af', fontSize: 14, fontWeight: 600 }}>
          Task not found
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{css}</style>
      <div className="td-root">

        <button className="td-back" onClick={() => navigate('/tasks')}>
          <ArrowLeft size={14} /> Back to Tasks
        </button>

        <div className="td-grid">

          {/* LEFT — Task detail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <div className="td-panel">
              <div className="td-status-bar">
                {task.completed
                  ? <span className="td-badge-done"><CheckCircle2 size={14} /> Completed</span>
                  : <span className="td-badge-pending"><Clock size={14} /> Pending</span>
                }
                <span className="td-id-badge"><Hash size={11} /> Task {task.id}</span>
              </div>

              <div className={`td-task-title${task.completed ? ' done' : ''}`}>
                {task.title}
              </div>

              <div className="td-divider" />

              <div className="td-meta-grid">
                <div className="td-meta-item">
                  <div className="td-meta-label"><Hash size={11} /> Task ID</div>
                  <div className="td-meta-val">#{task.id}</div>
                </div>
                <div className="td-meta-item">
                  <div className="td-meta-label"><User size={11} /> Assigned To</div>
                  <div className="td-meta-val">{user?.name?.split(' ')[0] ?? `User ${task.userId}`}</div>
                </div>
                <div className="td-meta-item" style={{ gridColumn: '1 / -1' }}>
                  <div className="td-meta-label">
                    {task.completed
                      ? <><CheckCircle2 size={11} color="#16a34a" /> Status</>
                      : <><Clock size={11} color="#ca8a04" /> Status</>
                    }
                  </div>
                  <div className="td-meta-val" style={{ color: task.completed ? '#16a34a' : '#ca8a04' }}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — User + other tasks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

            {/* User info */}
            <div className="td-panel">
              <div className="td-user-header">
                <div className="td-user-av">{user?.name?.[0] ?? 'U'}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="td-user-name">{user?.name ?? `User ${task.userId}`}</div>
                  <div className="td-user-handle">@{user?.username}</div>
                </div>
              </div>

              <div className="td-user-info">
                {[
                  { icon: <Mail size={13} />, val: user?.email },
                  { icon: <Phone size={13} />, val: user?.phone },
                  { icon: <Globe size={13} />, val: user?.website },
                  { icon: <Building2 size={13} />, val: user?.company?.name },
                ].map((item, i) => (
                  <div key={i} className="td-user-row">
                    <div className="td-user-icon">{item.icon}</div>
                    <span>{item.val}</span>
                  </div>
                ))}
              </div>

              <button
                className="td-profile-btn"
                onClick={() => navigate(`/users/${user?.id}`)}
              >
                View Full Profile →
              </button>
            </div>

            {/* Other tasks */}
            {otherTasks.length > 0 && (
              <div className="td-panel">
                <div className="td-panel-title">
                  Other Tasks
                  <span className="td-panel-badge">{otherTasks.length}</span>
                </div>
                {otherTasks.map(t => (
                  <div
                    key={t.id}
                    className="td-other-task"
                    onClick={() => navigate(`/tasks/${t.id}`)}
                  >
                    <div className="td-other-dot" style={{ background: t.completed ? '#22c55e' : '#f59e0b' }} />
                    <span className={`td-other-title${t.completed ? ' done' : ''}`}>{t.title}</span>
                    {t.completed
                      ? <CheckCircle2 size={12} color="#22c55e" style={{ flexShrink: 0 }} />
                      : <Clock size={12} color="#f59e0b" style={{ flexShrink: 0 }} />
                    }
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}