import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, SearchX } from 'lucide-react'

const PURPLE = "#5730e6"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .notfound-root {
    min-height: 100vh;
    background: var(--bg, #f0f2f5);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Nunito', sans-serif;
    padding: 24px;
  }

  .notfound-card {
    background: var(--bg-card, white);
    border-radius: 24px;
    padding: 48px 40px;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    max-width: 420px;
    width: 100%;
  }

  .notfound-icon-wrap {
    width: 80px; height: 80px; border-radius: 24px;
    background: var(--bg-purple-light, #f0ecff);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
  }

  .notfound-code {
    font-size: 64px; font-weight: 900; color: var(--purple, ${PURPLE});
    line-height: 1; letter-spacing: -3px; margin-bottom: 8px;
  }

  .notfound-title {
    font-size: 20px; font-weight: 800; color: var(--text-primary, #111827);
    margin-bottom: 10px;
  }

  .notfound-sub {
    font-size: 13px; color: var(--text-faint, #9ca3af);
    line-height: 1.6; margin-bottom: 32px;
  }

  .notfound-btns {
    display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;
  }

  .notfound-btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--purple, ${PURPLE}); color: white;
    border: none; border-radius: 12px; padding: 10px 20px;
    font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: 'Nunito', inherit;
    box-shadow: 0 4px 14px rgba(87,48,230,0.28);
    transition: opacity 0.15s;
  }
  .notfound-btn-primary:hover { opacity: 0.88; }

  .notfound-btn-outline {
    display: inline-flex; align-items: center; gap: 7px;
    background: transparent; color: var(--text-muted, #6b7280);
    border: 1.5px solid var(--border, #e5e7eb);
    border-radius: 12px; padding: 10px 20px;
    font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: 'Nunito', inherit;
    transition: all 0.15s;
  }
  .notfound-btn-outline:hover {
    border-color: var(--purple, ${PURPLE});
    color: var(--purple, ${PURPLE});
    background: var(--bg-purple-light, #f0ecff);
  }
`

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <style>{css}</style>
      <div className="notfound-root">
        <div className="notfound-card">
          <div className="notfound-icon-wrap">
            <SearchX size={36} color={PURPLE} />
          </div>
          <div className="notfound-code">404</div>
          <div className="notfound-title">Page not found</div>
          <div className="notfound-sub">
            The page you're looking for doesn't exist or has been moved.
          </div>
          <div className="notfound-btns">
            <button className="notfound-btn-primary" onClick={() => navigate('/')}>
              <Home size={14} /> Go Home
            </button>
            <button className="notfound-btn-outline" onClick={() => navigate(-1)}>
              <ArrowLeft size={14} /> Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  )
}