import { useState, useEffect } from 'react'
import { WifiOff, Wifi } from 'lucide-react'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .net-banner {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 9999;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 16px;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700;
    transform: translateY(-100%);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .net-banner.visible { transform: translateY(0); }
  .net-banner.offline { background: #1f2937; color: white; }
  .net-banner.online { background: #16a34a; color: white; }
`

export default function NetworkBanner() {
  const [status, setStatus] = useState(null) // null | 'offline' | 'online'
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timer

    const handleOffline = () => {
      setStatus('offline')
      setVisible(true)
    }

    const handleOnline = () => {
      setStatus('online')
      setVisible(true)
      // Hide "back online" after 3s
      timer = setTimeout(() => setVisible(false), 3000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
      clearTimeout(timer)
    }
  }, [])

  if (!status) return null

  return (
    <>
      <style>{css}</style>
      <div className={`net-banner ${status} ${visible ? 'visible' : ''}`}>
        {status === 'offline'
          ? <><WifiOff size={14} /> No internet connection</>
          : <><Wifi size={14} /> Back online!</>
        }
      </div>
    </>
  )
}