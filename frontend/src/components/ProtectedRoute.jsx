import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { userInfo } = useSelector((state) => state.auth)
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg, #F7F3EE)'
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid rgba(212,168,67,0.2)',
          borderTopColor: '#D4A843', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const activeUser = currentUser || userInfo

  if (!activeUser) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}
