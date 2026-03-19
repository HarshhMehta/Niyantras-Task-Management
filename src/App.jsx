import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import NetworkBanner from './components/NetworkBanner'
import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'
import ScrollToTop from './components/ScrollToTop'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import UserDetail from './pages/UserDetail'
import Tasks from './pages/Tasks'
import Posts from './pages/Posts'
import TaskDetail from './pages/TaskDetail'
import NotFound from './pages/NotFound'

function App() {
  return (
      <ErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <NetworkBanner />
          <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                <Route path="/posts" element={<Posts />} />
                {/* 404 — catch all unknown routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          <MobileNav />
        </BrowserRouter>
      </ErrorBoundary>
  )
}

export default App