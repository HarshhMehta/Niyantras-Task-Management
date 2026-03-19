import { Component } from 'react'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'

const PURPLE = "#5730e6"

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .eb-root {
    min-height: 100vh;
    background: var(--bg, #f0f2f5);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Nunito', sans-serif;
    padding: 24px;
  }

  .eb-card {
    background: var(--bg-card, white);
    border-radius: 24px; padding: 48px 40px;
    text-align: center; max-width: 440px; width: 100%;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  }

  .eb-icon-wrap {
    width: 80px; height: 80px; border-radius: 24px;
    background: #fef2f2;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
  }

  .eb-title {
    font-size: 20px; font-weight: 800; color: var(--text-primary, #111827);
    margin-bottom: 10px;
  }

  .eb-sub {
    font-size: 13px; color: var(--text-faint, #9ca3af);
    line-height: 1.6; margin-bottom: 24px;
  }

  .eb-detail {
    background: var(--bg-subtle, #f9fafb);
    border: 1px solid var(--border, #e5e7eb);
    border-radius: 10px; padding: 12px 16px;
    font-size: 11px; color: var(--text-muted, #6b7280);
    font-family: monospace; text-align: left;
    margin-bottom: 28px; word-break: break-word;
    max-height: 80px; overflow-y: auto;
  }

  .eb-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

  .eb-btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--purple, ${PURPLE}); color: white;
    border: none; border-radius: 12px; padding: 10px 20px;
    font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: 'Nunito', inherit;
    box-shadow: 0 4px 14px rgba(87,48,230,0.28);
    transition: opacity 0.15s;
  }
  .eb-btn-primary:hover { opacity: 0.88; }

  .eb-btn-outline {
    display: inline-flex; align-items: center; gap: 7px;
    background: transparent; color: var(--text-muted, #6b7280);
    border: 1.5px solid var(--border, #e5e7eb);
    border-radius: 12px; padding: 10px 20px;
    font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: 'Nunito', inherit; transition: all 0.15s;
  }
  .eb-btn-outline:hover {
    border-color: var(--purple, ${PURPLE});
    color: var(--purple, ${PURPLE});
    background: var(--bg-purple-light, #f0ecff);
  }
`

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <style>{css}</style>
          <div className="eb-root">
            <div className="eb-card">
              <div className="eb-icon-wrap">
                <AlertTriangle size={36} color="#dc2626" />
              </div>
              <div className="eb-title">Something went wrong</div>
              <div className="eb-sub">
                An unexpected error occurred. You can try reloading or go back to the home page.
              </div>
              {this.state.error && (
                <div className="eb-detail">
                  {this.state.error.toString()}
                </div>
              )}
              <div className="eb-btns">
                <button className="eb-btn-primary" onClick={this.handleReset}>
                  <Home size={14} /> Go Home
                </button>
                <button className="eb-btn-outline" onClick={this.handleRetry}>
                  <RefreshCw size={14} /> Try Again
                </button>
              </div>
            </div>
          </div>
        </>
      )
    }
    return this.props.children
  }
}