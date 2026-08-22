import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { logout } from '../store/slices/authSlice'
import { MoonIcon, SunIcon, GiftIcon, LogoutIcon } from './icons/LuxuryIcons'
import './Sidebar.css'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    path: '/dashboard',    icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
  { id: 'destinations', label: 'Destinations', path: '/destinations', icon: 'M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
  { id: 'trips',        label: 'Trips',        path: '/trips',        icon: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2' },
  { id: 'bookings',     label: 'Bookings',     path: '/bookings',     icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M12 12h.01 M12 16h.01' },
  { id: 'favorites',    label: 'Favorites',    path: '/favorites',    icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
  { id: 'messages',     label: 'Messages',     path: '/messages',     icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', badge: 3 },
  { id: 'travel-style', label: 'Travel Style', path: '/travel-style', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { id: 'settings',     label: 'Settings',     path: '/settings',     icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
  { id: 'emergency',    label: 'Emergency',    path: '/emergency',    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4 M12 16h.01' },
]

function NavIcon({ icon }) {
  const paths = icon.split(' M ').map((p, i) => i === 0 ? p : 'M ' + p)
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  )
}

export default function Sidebar() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const dispatch   = useDispatch()
  const { dark, toggle } = useTheme()
  const { userInfo } = useSelector((state) => state.auth)
  const [collapsed, setCollapsed] = useState(false)

  const displayName = userInfo?.name || 'Traveler'
  const avatarSrc   = userInfo?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&q=80&auto=format&fit=crop'
  const firstName   = displayName.split(' ')[0]

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <motion.aside
      className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.05 }}
    >
      <div className="sb-logo" onClick={() => navigate('/dashboard')}>
        {!collapsed ? (
          <div className="sb-logo-wanderlust">
            <span className="sb-logo-title">Y A T R A W A Y</span>
            <span className="sb-logo-subtitle">CURATED TRAVEL</span>
          </div>
        ) : (
          <div className="sb-logo-mark">
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#1A1A1A' }}>Y</span>
          </div>
        )}
        <button className="sb-collapse-btn" onClick={e => { e.stopPropagation(); setCollapsed(p => !p) }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points={collapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"}/></svg></button>
      </div>

      <nav className="sb-nav">
        {NAV.map(item => {
          const isActive = location.pathname === item.path
          return (
            <motion.button
              key={item.id}
              className={`sb-item ${isActive ? 'sb-item--active' : ''}`}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : ''}
              whileHover={{ x: 3, backgroundColor: isActive ? undefined : 'rgba(212,168,67,0.06)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              <span className="sb-item-icon"><NavIcon icon={item.icon} /></span>
              {!collapsed && <span className="sb-item-label">{item.label}</span>}
              {!collapsed && isActive && <span className="sb-active-dot" />}
              {!collapsed && item.badge && !isActive && <span className="sb-badge">{item.badge}</span>}
              {collapsed && item.badge && <span className="sb-badge sb-badge--dot" />}
            </motion.button>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="sb-bottom">
          <div className="sb-theme-row">
            <span className="sb-theme-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {dark ? <MoonIcon size={14} color="#A1A1AA" /> : <SunIcon size={14} color="#D4A843" />}
              {dark ? 'Dark' : 'Light'} Mode
            </span>
            <button className={`sb-toggle ${dark ? 'sb-toggle--on' : ''}`} onClick={toggle}>
              <span className="sb-toggle-thumb" />
            </button>
          </div>
          <div className="sb-referral">
            <div className="sb-referral-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GiftIcon size={16} color="#D4A843" />
            </div>
            <div>
              <p className="sb-referral-title">Get Extra 10% Off</p>
              <p className="sb-referral-desc">Refer friends & earn rewards</p>
            </div>
            <button className="sb-referral-btn" onClick={() => navigate('/profile')}>→</button>
          </div>
          <div className="sb-profile" onClick={() => navigate('/profile')}>
            <img src={avatarSrc} className="sb-avatar" alt={displayName} />
            <div className="sb-profile-info">
              <p className="sb-profile-name">{displayName}</p>
              <p className="sb-profile-role">Explorer</p>
            </div>
          </div>
          <button className="sb-logout" onClick={handleLogout}>
            <LogoutIcon size={15} /> Logout
          </button>
        </div>
      )}

      {collapsed && (
        <div className="sb-collapsed-bottom">
          <button className={`sb-icon-btn ${dark ? 'sb-icon-btn--active' : ''}`} onClick={toggle} title="Toggle theme"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{dark ? <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></> : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>}</svg></button>
          <img src={avatarSrc} className="sb-avatar" alt={firstName} onClick={() => navigate('/profile')} style={{ cursor:'pointer' }} />
          <button className="sb-icon-btn sb-icon-btn--danger" onClick={handleLogout} title="Logout"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>
        </div>
      )}
    </motion.aside>
  )
}
