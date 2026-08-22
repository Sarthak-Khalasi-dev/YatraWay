import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlaneIcon, HotelIcon, SparkleIcon, GiftIcon, MapPinIcon, CompassIcon, UserIcon, GearIcon, HeartIcon, LogoutIcon } from './icons/LuxuryIcons'
import './Topbar.css'

const NOTIFS = [
  { id: 1, iconType: 'flight', title: 'Flight Confirmed', desc: 'BLR → DPS on 20 May is confirmed!', time: '2m ago', unread: true },
  { id: 2, iconType: 'hotel', title: 'Hotel Check-in Tomorrow', desc: 'Komaneka at Bisma — check-in at 2PM', time: '1h ago', unread: true },
  { id: 3, iconType: 'price', title: 'Price Drop Alert', desc: 'Maldives package dropped by ₹8,000!', time: '3h ago', unread: true },
  { id: 4, iconType: 'review', title: 'Trip Review Request', desc: 'Rate your Goa experience', time: '1d ago', unread: false },
  { id: 5, iconType: 'gift', title: 'Referral Bonus Earned', desc: 'You earned ₹500 from your referral', time: '2d ago', unread: false },
]

const SEARCH_SUGGESTIONS = [
  { iconType: 'pin', label: 'Bali, Indonesia',    type: 'Destination' },
  { iconType: 'pin', label: 'Santorini, Greece',  type: 'Destination' },
  { iconType: 'flight', label: 'Upcoming Flights',   type: 'Booking' },
  { iconType: 'star', label: 'Scuba Diving',        type: 'Experience' },
  { iconType: 'compass', label: 'Japan Trip — Sep',   type: 'Trip' },
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

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })))

  const renderNotifIcon = (type) => {
    switch (type) {
      case 'flight': return <PlaneIcon size={16} color="#D4A843" />
      case 'hotel': return <HotelIcon size={16} color="#D4A843" />
      case 'price': return <SparkleIcon size={16} color="#D4A843" />
      case 'gift': return <GiftIcon size={16} color="#D4A843" />
      default: return <SparkleIcon size={16} color="#D4A843" />
    }
  }

  const renderSearchIcon = (type) => {
    switch (type) {
      case 'pin': return <MapPinIcon size={14} color="#8C867A" />
      case 'flight': return <PlaneIcon size={14} color="#8C867A" />
      case 'star': return <SparkleIcon size={14} color="#8C867A" />
      default: return <CompassIcon size={14} color="#8C867A" />
    }
  }

  return (
    <header className="topbar">
      <div className="tb-left">
        {title && <h1 className="tb-title">{title}</h1>}
        {subtitle && <p className="tb-subtitle">{subtitle}</p>}
      </div>

      <div className="tb-right">
        {/* Search */}
        <div className="tb-search-wrap" ref={searchRef}>
          <div className="tb-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tb-search-icon">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="tb-search-input"
              placeholder="Search destinations, bookings..."
              value={searchVal}
              onChange={e => { setSearchVal(e.target.value); setSearchOpen(true) }}
              onFocus={() => setSearchOpen(true)}
            />
            {searchVal && (
              <button className="tb-search-clear" onClick={() => setSearchVal('')}>✕</button>
            )}
          </div>

          {searchOpen && (
            <div className="tb-search-dropdown">
              <p className="tb-search-hdr">Quick Links</p>
              {SEARCH_SUGGESTIONS
                .filter(s => !searchVal || s.label.toLowerCase().includes(searchVal.toLowerCase()))
                .map((item, i) => (
                  <div key={i} className="tb-search-item" onClick={() => { setSearchVal(item.label); setSearchOpen(false); navigate('/destinations') }}>
                    <span className="tb-search-item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                      {renderSearchIcon(item.iconType)}
                    </span>
                    <span className="tb-search-item-label">{item.label}</span>
                    <span className="tb-search-item-type">{item.type}</span>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="tb-notif-wrap" ref={notifRef}>
          <button className={`tb-notif-btn ${unreadCount ? 'tb-notif-btn--has-unread' : ''}`} onClick={() => { setNotifOpen(p => !p); setUserOpen(false) }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && <span className="tb-notif-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="tb-notif-dropdown">
              <div className="tb-notif-header">
                <div>
                  <p className="tb-notif-title">Notifications</p>
                  <p className="tb-notif-sub">{unreadCount} unread</p>
                </div>
                {unreadCount > 0 && (
                  <button className="tb-mark-read" onClick={markAllRead}>Mark all read</button>
                )}
              </div>
              <div className="tb-notif-list">
                {notifs.map(n => (
                  <div key={n.id} className={`tb-notif-item ${n.unread ? 'tb-notif-item--unread' : ''}`} onClick={() => { setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x)) }}>
                    <div className="tb-notif-icon-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {renderNotifIcon(n.iconType)}
                    </div>
                    <div className="tb-notif-body">
                      <p className="tb-notif-item-title">{n.title}</p>
                      <p className="tb-notif-item-desc">{n.desc}</p>
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
                { icon: <UserIcon size={14} color="#8C867A" />, label: 'My Profile',    path: '/profile' },
                { icon: <GearIcon size={14} color="#8C867A" />, label: 'Settings',      path: '/settings' },
                { icon: <HeartIcon size={14} color="#8C867A" />, label: 'Favorites',     path: '/favorites' },
                { icon: <GiftIcon size={14} color="#8C867A" />, label: 'Refer & Earn',  path: '/profile' },
              ].map(item => (
                <button key={item.label} className="tb-menu-item" onClick={() => { navigate(item.path); setUserOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.icon} {item.label}
                </button>
              ))}
              <div className="tb-menu-div" />
              <button className="tb-menu-item tb-menu-item--danger" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LogoutIcon size={14} color="var(--red)" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
