import { useState, useMemo, useEffect } from "react";
import {
  RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis,
} from "recharts";
import {
  CheckCircle2, Clock, FileText, Users,
  MessageCircle, User, ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { getUsers, getTodos, getPosts, getComments } from "../services/api";
import Header from "../components/Header";

const PURPLE = "#5730e6";

function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return val;
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', 'Segoe UI', sans-serif; }

  .dash-root {
    display: flex; flex-direction: column;
    min-height: 100vh; background: #f0f2f5;
    font-family: 'Nunito', 'Segoe UI', sans-serif;
  }

  .content { padding: 20px 24px; flex: 1; }

  /* ── Row 1 ── */
  .row1 { display: grid; grid-template-columns: 1fr 1.65fr; gap: 16px; margin-bottom: 16px; }
  .stat-cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .stat-card {
    border-radius: 16px; padding: 16px;
    display: flex; flex-direction: column; justify-content: space-between;
    min-height: 118px; background: white;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    transition: transform 0.18s, box-shadow 0.18s;
    cursor: pointer;
  }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.10); }
  .stat-card.purple {
    background: linear-gradient(145deg, #5730e6 0%, #7c5cf6 55%, rgba(255,255,255,0.18) 100%);
    box-shadow: 0 6px 24px rgba(87,48,230,0.22);
  }
  .stat-card.purple:hover { box-shadow: 0 14px 36px rgba(87,48,230,0.32); }
  .stat-card-header { display: flex; align-items: center; justify-content: space-between; }
  .stat-title { font-size: 12px; font-weight: 600; color: #6b7280; }
  .stat-card.purple .stat-title { color: rgba(255,255,255,0.75); }
  .stat-icon {
    width: 32px; height: 32px; border-radius: 10px; background: #f3f4f6;
    display: flex; align-items: center; justify-content: center; color: #6b7280;
    transition: background 0.15s, color 0.15s; flex-shrink: 0;
  }
  .stat-card:hover .stat-icon { background: #ede9fe; color: ${PURPLE}; }
  .stat-card.purple .stat-icon { background: rgba(255,255,255,0.18); color: white; }
  .stat-value { font-size: 32px; font-weight: 900; color: #111827; letter-spacing: -1.5px; line-height: 1; margin: 6px 0; }
  .stat-card.purple .stat-value { color: white; }
  .stat-change { display: flex; align-items: center; gap: 4px; font-size: 11px; flex-wrap: wrap; }
  .change-up { color: #22c55e; font-weight: 700; }
  .change-down { color: #ef4444; font-weight: 700; }
  .stat-card.purple .change-up { color: #86efac; }
  .change-vs { color: #9ca3af; }
  .stat-card.purple .change-vs { color: rgba(255,255,255,0.5); }

  .skeleton {
    background: linear-gradient(90deg, #f3f4f6 25%, #e9eaf0 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite; border-radius: 8px;
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .right-panels { display: grid; grid-template-columns: 1fr 1.35fr; gap: 12px; align-items: stretch; }

  .panel {
    background: white; border-radius: 16px; padding: 18px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  }
  .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .panel-title { font-size: 13px; font-weight: 800; color: #1f2937; }
  .panel-badge {
    font-size: 10px; color: #6b7280; border: 1.5px solid #e5e7eb;
    border-radius: 7px; padding: 2px 9px; font-weight: 600; white-space: nowrap;
  }

  /* Row 2 */
  .row2 { display: grid; grid-template-columns: 1fr 1.4fr; gap: 16px; }

  .overview-stats { display: flex; gap: 10px; margin-bottom: 16px; }
  .ov-stat { flex: 1; min-width: 0; }
  .ov-stat-label { display: flex; align-items: center; gap: 4px; font-size: 10px; color: #6b7280; margin-bottom: 3px; }
  .ov-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
  .ov-val { font-size: 15px; font-weight: 800; color: #111827; margin-bottom: 6px; }
  .ov-bar-track { height: 4px; border-radius: 99px; background: #f3f4f6; overflow: hidden; }
  .ov-bar-fill { height: 4px; border-radius: 99px; width: 0%; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }

  .ov-table-header {
    display: grid; grid-template-columns: 1.8fr 0.6fr 0.6fr;
    font-size: 10px; color: #9ca3af; font-weight: 700;
    padding: 10px 6px 6px; border-top: 1.5px solid #f3f4f6;
  }
  .ov-row {
    display: grid; grid-template-columns: 1.8fr 0.6fr 0.6fr;
    font-size: 12px; padding: 8px 6px; border-bottom: 1px solid #f9fafb;
    align-items: center; border-radius: 8px; cursor: pointer;
    transition: background 0.12s, transform 0.12s;
  }
  .ov-row:hover { background: #faf9ff; transform: translateX(2px); }
  .ov-name { font-weight: 700; color: #374151; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 8px; }
  .ov-pct { color: #6b7280; display: flex; align-items: center; gap: 3px; }
  .ov-status-done { font-size: 10px; background: #dcfce7; color: #16a34a; border-radius: 99px; padding: 2px 8px; font-weight: 700; display: inline-block; }
  .ov-status-pending { font-size: 10px; background: #fef9c3; color: #ca8a04; border-radius: 99px; padding: 2px 8px; font-weight: 700; display: inline-block; }

  /* User table */
  .team-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .team-table th { text-align: left; font-size: 10px; color: #9ca3af; font-weight: 700; padding-bottom: 10px; border-bottom: 1.5px solid #f3f4f6; white-space: nowrap; }
  .team-table td { padding: 10px 0; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
  .team-table tbody tr { transition: background 0.12s; cursor: pointer; }
  .team-table tbody tr:hover td { background: #faf9ff; }
  .td-id { color: #9ca3af; font-weight: 500; }
  .td-name { font-weight: 800; color: #111827; }
  .td-email { color: #6b7280; font-size: 11px; }

  .progress-wrap { display: flex; align-items: center; gap: 7px; }
  .progress-track { flex: 1; background: #f3f4f6; border-radius: 99px; height: 6px; overflow: hidden; }
  .progress-fill { height: 6px; border-radius: 99px; background: linear-gradient(90deg, ${PURPLE}, #a78bfa); width: 0%; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
  .progress-label { font-size: 11px; font-weight: 700; color: ${PURPLE}; min-width: 30px; text-align: right; }

  .user-av {
    width: 28px; height: 28px; border-radius: 8px;
    background: linear-gradient(135deg, ${PURPLE}, #a78bfa);
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white; margin-right: 8px; flex-shrink: 0;
  }
  .user-av-wrap { display: flex; align-items: center; }

  /* Posts */
  .post-block {
    padding: 10px; border-radius: 10px; border: 1.5px solid #f3f4f6;
    margin-bottom: 8px; cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s;
  }
  .post-block:hover {
    background: #faf9ff; border-color: #ede9fe;
    transform: translateY(-1px); box-shadow: 0 4px 12px rgba(87,48,230,0.08);
  }
  .post-title {
    font-size: 12px; font-weight: 800; color: #1f2937;
    margin-bottom: 8px; line-height: 1.4;
    display: -webkit-box; -webkit-line-clamp: 1;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .post-author { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
  .post-author-av {
    width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, ${PURPLE}, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; color: white;
  }
  .post-author-name { font-size: 11px; font-weight: 700; color: ${PURPLE}; }

  .comment-item {
    display: flex; align-items: flex-start; gap: 8px;
    padding: 5px 4px; min-width: 0; border-radius: 8px;
    transition: background 0.12s;
  }
  .comment-item:hover { background: #f3f0ff; }
  .comment-av {
    width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
    background: #f3f4f6; border: 1.5px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: #6b7280;
  }
  .comment-body { flex: 1; min-width: 0; overflow: hidden; }
  .comment-line {
    font-size: 11px; color: #374151; line-height: 1.5;
    display: -webkit-box; -webkit-line-clamp: 1;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .comment-line strong { font-weight: 700; color: #111827; margin-right: 4px; }

  .view-more-btn {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    margin-top: 10px; padding: 8px 14px; width: 100%;
    border-radius: 10px; border: 1.5px dashed #e5e7eb;
    background: #faf9ff; color: ${PURPLE};
    font-size: 12px; font-weight: 700; cursor: pointer;
    font-family: 'Nunito', inherit; transition: all 0.15s;
  }
  .view-more-btn:hover { background: #ede9fe; border-color: ${PURPLE}; transform: translateY(-1px); }

  /* ===================== RESPONSIVE ===================== */

  /* Tablet landscape ≤1100px */
  @media (max-width: 1100px) {
    .row1 { grid-template-columns: 1fr; }
    .right-panels { grid-template-columns: 1fr 1fr; }
    .row2 { grid-template-columns: 1fr 1fr; }
  }

  /* Tablet portrait ≤900px */
  @media (max-width: 900px) {
    .content { padding: 16px; }
    .right-panels { grid-template-columns: 1fr 1fr; }
    .row2 { grid-template-columns: 1fr; }
  }

  /* Mobile large ≤700px */
  @media (max-width: 700px) {
    .content { padding: 12px; }
    .right-panels { grid-template-columns: 1fr; }
    .row2 { grid-template-columns: 1fr; }
    .stat-card { min-height: 100px; padding: 14px; }
    .stat-value { font-size: 26px; }
  }

  /* Mobile ≤480px */
  @media (max-width: 480px) {
    .content { padding: 10px; }
    .stat-cards-grid { gap: 8px; }
    .stat-card { min-height: 90px; padding: 12px; }
    .stat-value { font-size: 22px; }
    .stat-title { font-size: 11px; }
    .overview-stats { flex-wrap: wrap; }
    .ov-stat { min-width: calc(50% - 5px); flex: none; }
    /* Hide email + tasks cols */
    .team-table th:nth-child(3), .team-table td:nth-child(3),
    .team-table th:nth-child(4), .team-table td:nth-child(4) { display: none; }
    .panel { padding: 14px; }
    .panel-title { font-size: 12px; }
    .change-vs { display: none; }
  }

  /* Extra small ≤380px */
  @media (max-width: 380px) {
    .stat-cards-grid { gap: 6px; }
    .stat-card { padding: 10px; min-height: 80px; }
    .stat-value { font-size: 20px; }
    .stat-icon { width: 26px; height: 26px; }
  }
`;

function StatCard({ title, value, change, positive = true, purple = false, icon, loading, onClick }) {
  const animated = useCountUp(loading ? 0 : (value ?? 0));
  return (
    <div className={`stat-card${purple ? " purple" : ""}`} onClick={onClick}>
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      {loading
        ? <div className="skeleton" style={{ height: 38, width: "55%", margin: "8px 0" }} />
        : <div className="stat-value">{animated}</div>
      }
      <div className="stat-change">
        <span className={positive ? "change-up" : "change-down"}>{positive ? "▲" : "▼"} {change}</span>
        <span className="change-vs">vs last month</span>
      </div>
    </div>
  );
}

function AnimatedStatBar({ item, loading }) {
  const [barWidth, setBarWidth] = useState(0);
  const animatedNum = useCountUp(loading ? 0 : item.value);
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => setBarWidth(item.value), 100);
    return () => clearTimeout(t);
  }, [loading, item.value]);
  return (
    <div className="ov-stat">
      <div className="ov-stat-label">
        <span className="ov-dot" style={{ background: item.dot }} />{item.label}
      </div>
      <div className="ov-val">
        {loading
          ? <div className="skeleton" style={{ height: 18, width: 40, borderRadius: 6 }} />
          : (item.label === "Posts" ? animatedNum : `${animatedNum}%`)
        }
      </div>
      <div className="ov-bar-track">
        <div className="ov-bar-fill" style={{ background: item.bar, width: `${barWidth}%` }} />
      </div>
    </div>
  );
}

function ProgressBar({ value }) {
  const [width, setWidth] = useState(0);
  const animated = useCountUp(value);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 150);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="progress-wrap">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${width}%` }} />
      </div>
      <span className="progress-label">{animated}%</span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: users, loading: uLoading } = useFetch(getUsers);
  const { data: todos, loading: tLoading } = useFetch(getTodos);
  const { data: posts, loading: pLoading } = useFetch(getPosts);
  const { data: comments1, loading: c1Loading } = useFetch(() => getComments(1));

  const stats = useMemo(() => {
    if (!todos) return { total: 0, completed: 0, pending: 0 };
    const completed = todos.filter((t) => t.completed).length;
    return { total: todos.length, completed, pending: todos.length - completed };
  }, [todos]);

  const completionPct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  const animatedPct = useCountUp(completionPct);
  const recentTodos = useMemo(() => (todos ? todos.slice(0, 6) : []), [todos]);

  const userTaskStats = useMemo(() => {
    if (!users || !todos) return [];
    return users.slice(0, 5).map((u) => {
      const userTodos = todos.filter((t) => t.userId === u.id);
      const done = userTodos.filter((t) => t.completed).length;
      const pct = userTodos.length ? Math.round((done / userTodos.length) * 100) : 0;
      return { ...u, totalTasks: userTodos.length, doneTasks: done, pct };
    });
  }, [users, todos]);

  const featuredPost = posts?.[0] ?? null;
  const postComments = (comments1 ?? []).slice(0, 2);
  const postAuthor = featuredPost ? (users ?? []).find(u => u.id === featuredPost.userId) : null;

  return (
    <>
      <style>{css}</style>
      <div className="dash-root">
        <Header />
        <div className="content">

          {/* ── Row 1 ── */}
          <div className="row1">
            <div className="stat-cards-grid">
              <StatCard title="Total Tasks" value={stats.total} change="+3.5%" positive icon={<FileText size={15} />} purple loading={tLoading} onClick={() => navigate("/tasks")} />
              <StatCard title="Total Users" value={users?.length ?? 0} change="+2.1%" positive={false} icon={<Users size={15} />} loading={uLoading} onClick={() => navigate("/users")} />
              <StatCard title="Total Posts" value={posts?.length ?? 0} change="+5.0%" positive icon={<FileText size={15} />} loading={pLoading} onClick={() => navigate("/posts")} />
              <StatCard title="Completed" value={stats.completed} change="+3.5%" positive icon={<CheckCircle2 size={15} />} loading={tLoading} onClick={() => navigate("/tasks")} />
            </div>

            <div className="right-panels">
              {/* Posts & Comments */}
              <div className="panel" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div className="panel-header">
                  <span className="panel-title">Posts &amp; Comments</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <MessageCircle size={12} color="#9ca3af" />
                    <span className="panel-badge">Latest</span>
                  </span>
                </div>
                {(pLoading || c1Loading)
                  ? <div className="skeleton" style={{ height: 120, borderRadius: 10 }} />
                  : featuredPost && (
                    <div className="post-block" onClick={() => navigate("/posts")}>
                      <div className="post-author">
                        <div className="post-author-av">{postAuthor?.name?.[0] ?? "U"}</div>
                        <span className="post-author-name">{postAuthor?.name?.split(" ")[0] ?? `User ${featuredPost.userId}`}</span>
                      </div>
                      <div className="post-title">{featuredPost.title}</div>
                      {postComments.map((c) => (
                        <div key={c.id} className="comment-item">
                          <div className="comment-av">{c.email[0].toUpperCase()}</div>
                          <div className="comment-body">
                            <div className="comment-line">
                              <strong>{c.email.split("@")[0]}</strong>
                              {c.body.length > 60 ? c.body.slice(0, 60) + "…" : c.body}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }
                <button className="view-more-btn" onClick={() => navigate("/posts")}>
                  <MessageCircle size={12} /> View all posts <ChevronRight size={12} />
                </button>
              </div>

              {/* Radial Gauge */}
              <div className="panel" style={{ display: "flex", flexDirection: "column" }}>
                <div className="panel-header">
                  <span className="panel-title">Performance Overview</span>
                  <span className="panel-badge">All Time</span>
                </div>
                {tLoading
                  ? <div className="skeleton" style={{ flex: 1, minHeight: 160, borderRadius: 12 }} />
                  : (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 12 }}>
                      <div style={{ position: "relative", width: "100%", maxWidth: 200 }}>
                        <ResponsiveContainer width="100%" height={130}>
                          <RadialBarChart
                            cx="50%" cy="100%"
                            innerRadius="120%" outerRadius="160%"
                            startAngle={180} endAngle={0}
                            data={[{ value: 100, fill: "#ede9fe" }, { value: completionPct, fill: PURPLE }]}
                          >
                            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                            <RadialBar dataKey="value" cornerRadius={8} background={false} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", textAlign: "center", lineHeight: 1.2, pointerEvents: "none", whiteSpace: "nowrap" }}>
                          <div style={{ fontSize: 26, fontWeight: 900, color: "#111827" }}>{animatedPct}%</div>
                          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>Tasks Complete</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 32, justifyContent: "center", alignItems: "center", width: "100%" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 10, color: "#9ca3af", marginBottom: 4 }}>
                            <CheckCircle2 size={10} color="#22c55e" /> Complete
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{stats.completed}</div>
                        </div>
                        <div style={{ width: 1, height: 32, background: "#f3f4f6" }} />
                        <div style={{ textAlign: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 10, color: "#9ca3af", marginBottom: 4 }}>
                            <Clock size={10} color="#f59e0b" /> Pending
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{stats.pending}</div>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          {/* ── Row 2 ── */}
          <div className="row2">
            {/* Recent Tasks */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Recent Tasks</span>
                <span className="panel-badge">{recentTodos.length} Tasks</span>
              </div>
              <div className="overview-stats">
                {[
                  { label: "Completed", value: completionPct, dot: PURPLE, bar: `linear-gradient(90deg, ${PURPLE}, #a78bfa)` },
                  { label: "Pending", value: stats.total ? Math.round((stats.pending / stats.total) * 100) : 0, dot: "#f87171", bar: "linear-gradient(90deg, #f87171, #fca5a5)" },
                  { label: "Posts", value: posts?.length ?? 0, dot: "#fbbf24", bar: "linear-gradient(90deg, #fbbf24, #fde68a)" },
                ].map((item) => (
                  <AnimatedStatBar key={item.label} item={item} loading={tLoading || pLoading} />
                ))}
              </div>
              <div className="ov-table-header">
                <span>Task Title</span><span>User</span><span>Status</span>
              </div>
              {tLoading
                ? Array(5).fill(0).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 34, marginBottom: 6, borderRadius: 8 }} />
                  ))
                : recentTodos.map((todo) => (
                    <div key={todo.id} className="ov-row" onClick={() => navigate("/tasks")}>
                      <span className="ov-name">{todo.title}</span>
                      <span className="ov-pct"><User size={10} />#{todo.userId}</span>
                      <span>
                        {todo.completed
                          ? <span className="ov-status-done">Done</span>
                          : <span className="ov-status-pending">Pending</span>
                        }
                      </span>
                    </div>
                  ))
              }
            </div>

            {/* User Overview */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">User Overview</span>
                <span className="panel-badge">Top 5</span>
              </div>
              {/* overflowX: auto so table scrolls horizontally on small screens */}
              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <table className="team-table" style={{ minWidth: 300 }}>
                  <thead>
                    <tr>{["#", "Name", "Email", "Tasks", "Progress"].map((h) => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {(uLoading || tLoading)
                      ? Array(5).fill(0).map((_, i) => (
                          <tr key={i}>
                            {Array(5).fill(0).map((__, j) => (
                              <td key={j}><div className="skeleton" style={{ height: 14, width: j === 1 ? 80 : j === 4 ? 90 : 36, borderRadius: 6 }} /></td>
                            ))}
                          </tr>
                        ))
                      : userTaskStats.map((u) => (
                          <tr key={u.id} onClick={() => navigate(`/users/${u.id}`)}>
                            <td className="td-id">{String(u.id).padStart(2, "0")}</td>
                            <td>
                              <div className="user-av-wrap">
                                <div className="user-av">{u.name[0]}</div>
                                <span className="td-name">{u.name.split(" ")[0]}</span>
                              </div>
                            </td>
                            <td className="td-email">{u.email}</td>
                            <td style={{ color: "#6b7280", fontSize: 12 }}>{u.totalTasks}</td>
                            <td style={{ minWidth: 110 }}><ProgressBar value={u.pct} /></td>
                          </tr>
                        ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}