import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Topbar.css'

const NOTIFS = [
  { id: 1, icon: '✈️', title: 'Flight Confirmed', desc: 'BLR → DPS on 20 May is confirmed!', time: '2m ago', unread: true },
  { id: 2, icon: '🏨', title: 'Hotel Check-in Tomorrow', desc: 'Komaneka at Bisma — check-in at 2PM', time: '1h ago', unread: true },
  { id: 3, icon: '💰', title: 'Price Drop Alert', desc: 'Maldives package dropped by ₹8,000!', time: '3h ago', unread: true },
  { id: 4, icon: '🌟', title: 'Trip Review Request', desc: 'Rate your Goa experience', time: '1d ago', unread: false },
  { id: 5, icon: '🎁', title: 'Referral Bonus Earned', desc: 'You earned ₹500 from your referral', time: '2d ago', unread: false },
]

const SEARCH_SUGGESTIONS = [
  { icon: '📍', label: 'Bali, Indonesia',    type: 'Destination' },
  { icon: '📍', label: 'Santorini, Greece',  type: 'Destination' },
  { icon: '✈️', label: 'Upcoming Flights',   type: 'Booking' },
  { icon: '🌟', label: 'Scuba Diving',        type: 'Experience' },
  { icon: '🗺️', label: 'Japan Trip — Sep',   type: 'Trip' },
]

export default function Topbar({ title, subtitle }) {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState(NOTIFS)
  const [userOpen, setUserOpen] = useState(false)
  const searchRef = useRef(null)
  const notifRef = useRef(null)

  const unreadCount = notifs.filter(n => n.unread).length

  useEffect(() => {
    const close = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const markAllRead = () => setNotifs(p => p.map(n => ({ ...n, unread: false })))

  const suggestions = searchVal
    ? SEARCH_SUGGESTIONS.filter(s => s.label.toLowerCase().includes(searchVal.toLowerCase()))
    : SEARCH_SUGGESTIONS

  return (
    <header className="topbar">
      <div className="topbar-left">
        {title && <h1 className="topbar-title">{title}</h1>}
        {subtitle && <p className="topbar-sub">{subtitle}</p>}
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="tb-search-wrap" ref={searchRef}>
          <div className={`tb-search ${searchOpen ? 'tb-search--open' : ''}`}>
            <svg className="tb-search-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="tb-search-inp"
              placeholder="Search destinations, trips..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onFocus={() => setSearchOpen(true)}
            />
            {searchVal && (
              <button className="tb-search-clear" onClick={() => setSearchVal('')}>✕</button>
            )}
          </div>
          {searchOpen && (
            <div className="tb-search-drop">
              <p className="tb-search-drop-lbl">{searchVal ? 'Results' : 'Quick Search'}</p>
              {suggestions.map(s => (
                <button key={s.label} className="tb-search-item" onClick={() => { setSearchOpen(false); setSearchVal('') }}>
                  <span className="tb-search-item-icon">{s.icon}</span>
                  <span className="tb-search-item-label">{s.label}</span>
                  <span className="tb-search-item-type">{s.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="tb-notif-wrap" ref={notifRef}>
          <button className="tb-icon-btn" onClick={() => { setNotifOpen(p => !p); setUserOpen(false) }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {unreadCount > 0 && <span className="tb-notif-dot">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="tb-notif-panel">
              <div className="tb-panel-hd">
                <p className="tb-panel-title">Notifications</p>
                <button className="tb-mark-read" onClick={markAllRead}>Mark all read</button>
              </div>
              <div className="tb-notif-list">
                {notifs.map(n => (
                  <div key={n.id} className={`tb-notif-item ${n.unread ? 'tb-notif-item--unread' : ''}`}
                    onClick={() => setNotifs(p => p.map(x => x.id===n.id ? {...x,unread:false} : x))}>
                    <span className="tb-notif-ico">{n.icon}</span>
                    <div className="tb-notif-body">
                      <p className="tb-notif-title">{n.title}</p>
                      <p className="tb-notif-desc">{n.desc}</p>
                      <p className="tb-notif-time">{n.time}</p>
                    </div>
                    {n.unread && <span className="tb-unread-dot" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User chip */}
        <div className="tb-user-wrap">
          <button className="tb-user-chip" onClick={() => { setUserOpen(p => !p); setNotifOpen(false) }}>
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&fit=crop&crop=face" className="tb-avatar" alt="User" />
            <div className="tb-user-info">
              <p className="tb-user-name">Hi, Ananya</p>
              <p className="tb-user-role">Explorer ▾</p>
            </div>
          </button>
          {userOpen && (
            <div className="tb-user-menu">
              {[
                { icon: '👤', label: 'My Profile',    path: '/profile' },
                { icon: '⚙️', label: 'Settings',      path: '/settings' },
                { icon: '❤️', label: 'Favorites',     path: '/favorites' },
                { icon: '🎁', label: 'Refer & Earn',  path: '/profile' },
              ].map(item => (
                <button key={item.label} className="tb-menu-item" onClick={() => { navigate(item.path); setUserOpen(false) }}>
                  {item.icon} {item.label}
                </button>
              ))}
              <div className="tb-menu-div" />
              <button className="tb-menu-item tb-menu-item--danger" onClick={() => navigate('/')}>🚪 Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
