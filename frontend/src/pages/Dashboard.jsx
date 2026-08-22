import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'
import { fetchTrips } from '../store/slices/tripSlice'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  HERO_IMG, HERO_SMALL_A, HERO_SMALL_B,
  REC_IMGS, ADV_MOUNTAIN, ADV_NIGHT_SKY,
  NEXT_TRIP_THUMB, TRIP_IMGS
} from '../data/images'
import './Dashboard.css'

// ── MUI Imports ──
import { Tooltip, CircularProgress, IconButton, Badge } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import SearchIcon from '@mui/icons-material/Search'
import { trackEvent } from '../services/analytics'

const RECS = [
  { name: 'Maldives',    tag: 'Paradise on Earth', rating: 4.8, reviews: 320, img: REC_IMGS.maldives },
  { name: 'Switzerland', tag: 'Alpine Wonderland',  rating: 4.9, reviews: 280, img: REC_IMGS.switzerland },
  { name: 'Greece',      tag: 'Timeless Beauty',    rating: 4.7, reviews: 210, img: REC_IMGS.greece },
  { name: 'Bali',        tag: 'Island of Gods',     rating: 4.8, reviews: 420, img: REC_IMGS.bali },
]

const BLOG = [
  {
    title: 'A Complete Guide to Cappadocia',
    desc: 'Discover the magical land of hot air balloons.',
    date: 'April 20, 2024',
    img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=260&q=80&auto=format&fit=crop',
  },
  {
    title: '10 Most Beautiful Coastal Towns',
    desc: 'Stunning views and relaxing vibes.',
    date: 'May 12, 2024',
    img: 'https://images.unsplash.com/photo-1533104182429-4b31e8ae3e9e?w=400&h=260&q=80&auto=format&fit=crop',
  },
  {
    title: 'Top 7 Hidden Gems in Asia',
    desc: 'Offbeat places you must explore.',
    date: 'April 18, 2024',
    img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=260&q=80&auto=format&fit=crop',
  },
]

function StarFill() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
function HeartFilled({ on }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill={on ? '#EF4444' : 'none'} stroke={on ? '#EF4444' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [liked, setLiked] = useState({})
  const [notif, setNotif] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { userInfo } = useSelector((state) => state.auth)
  const { trips, loading: tripsLoading } = useSelector((state) => state.trips)
  
  usePageTitle('Dashboard')

  const firstName = userInfo?.name?.split(' ')[0] || 'Explorer'
  const upcomingTrips = [...trips]
    .filter(t => t.status === 'Upcoming' || t.status === 'Ongoing')
    .slice(0, 3)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40)
    dispatch(fetchTrips())
    return () => clearTimeout(t)
  }, [dispatch])

  const handleExplore = (r) => {
    trackEvent('Dashboard', 'Explore Recommendation', r.name)
    navigate('/trips', { state: { initialDest: r.name, initialImg: r.img } })
  }

  return (
    <div className={`db ${mounted ? 'db--on' : ''}`}>
      <Sidebar />

      <div className="main">
        {/* ── Top bar ── */}
        <header className="topbar">
          <div className="search-wrap">
            <SearchIcon sx={{ fontSize: 20, color: '#9CA3AF', mr: 1 }} />
            <input className="search-inp" placeholder="Search destinations, experiences..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="topbar-r">
            <Tooltip title="Notifications">
              <IconButton className="bell-btn" onClick={() => setNotif(false)} sx={{ color: 'inherit' }}>
                <Badge variant="dot" color="error" invisible={!notif}>
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="View Profile">
              <div className="user-chip" onClick={() => navigate('/profile')} style={{ cursor:'pointer' }}>
                <img src={userInfo?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&q=80&auto=format&fit=crop'} className="u-avatar" alt="User" />
                <div><p className="u-hi">Hi, {firstName}</p><p className="u-role">Explorer <span>▾</span></p></div>
              </div>
            </Tooltip>
          </div>
        </header>

        <div className="scroll-area">

          {/* ── HERO ── */}
          <div className="hero">
            <img src={HERO_IMG} className="hero-bg" alt="" />
            <div className="hero-grad" />
            <div className="hero-txt">
              <h1 className="hero-h1">EXPLORE<br />MORE<br />LIVE MORE</h1>
              <p className="hero-p">The world is waiting for you</p>
            </div>
            <div className="collect-badge">
              <svg viewBox="0 0 110 110" width="90" height="90" className="collect-ring">
                <defs><path id="arc" d="M55,55 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1-70,0"/></defs>
                <text fontSize="8.5" fill="rgba(255,255,255,0.8)" letterSpacing="2.4" fontFamily="'DM Sans',sans-serif" fontWeight="500">
                  <textPath href="#arc">COLLECT MOMENTS • COLLECT MOMENTS •</textPath>
                </text>
              </svg>
              <div className="collect-cam">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>
            <div className="hero-pics">
              <div className="hero-pic-wrap hero-pic-a"><img src={HERO_SMALL_A} alt="" /></div>
              <div className="hero-pic-wrap hero-pic-b"><img src={HERO_SMALL_B} alt="" /></div>
            </div>
            <div className="hero-dots">
              {[0,1,2].map(i => <span key={i} className={`hdot ${i===0?'hdot-on':''}`} />)}
            </div>
          </div>

          <div className="info-row">
            <div className="info-card">
              <div className="info-ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
              <div><p className="info-lbl">Current Location</p><p className="info-val">Bangalore, India</p></div>
            </div>
            <div className="info-div" />
            <div className="info-card">
              <div className="info-dest-thumb"><img src={NEXT_TRIP_THUMB} alt="Bali" /></div>
              <div><p className="info-lbl">Your Next Trip</p><p className="info-val">Bali, Indonesia</p></div>
            </div>
            <div className="info-div" />
            <div className="info-card info-card--emergency" onClick={() => navigate('/emergency')}>
              <div className="info-ico info-ico--red"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
              <div><p className="info-lbl text-red">Safety Center</p><p className="info-val">SOS & Emergency</p></div>
              <div className="info-sos-pulse" />
            </div>
          </div>

          <section className="sec">
            <div className="sec-hd"><h2 className="sec-title">Recommended For You</h2><button className="view-all" onClick={() => navigate('/destinations')}>View All →</button></div>
            <div className="rec-grid">
              {RECS.map((r, i) => (
                <div className="rec-card" key={r.name} style={{ animationDelay: `${i * 0.07}s`, cursor: 'pointer' }} onClick={() => handleExplore(r)}>
                  <div className="rec-img-wrap">
                    <img src={r.img} alt={r.name} className="rec-img" />
                    <button className={`rec-heart ${liked[i] ? 'rec-heart--on' : ''}`} onClick={(e) => { e.stopPropagation(); setLiked(p => ({ ...p, [i]: !p[i] })) }}><HeartFilled on={liked[i]} /></button>
                  </div>
                  <div className="rec-info"><p className="rec-name">{r.name}</p><p className="rec-tag">{r.tag}</p><div className="rec-rating"><StarFill /><span className="rec-score">{r.rating}</span><span className="rec-rev">({r.reviews} reviews)</span></div></div>
                </div>
              ))}
            </div>
          </section>

          <section className="sec">
            <div className="sec-hd"><h2 className="sec-title">Plan Your Next Adventure</h2><button className="view-all">View All →</button></div>
            <div className="adv-grid">
              <div className="adv-photo"><img src={ADV_MOUNTAIN} alt="Mountain" /><div className="adv-caption"><p className="adv-cap-name">Mountain Escape</p><p className="adv-cap-loc">Himachal Pradesh</p></div></div>
              <div className="adv-cta">
                <div className="adv-cta-icons"><div className="adv-cta-icon-row"><div className="adv-mini-ico">📍</div><span>Choose Destination</span><div className="adv-mini-ico">📅</div><span>Select Dates</span><div className="adv-mini-ico">✈️</div><span>Travel Style</span></div></div>
                <h3 className="adv-cta-h">Plan your dream<br />trip today!</h3><p className="adv-cta-p">Tell us your preferences and we'll craft the perfect journey for you.</p>
                <button className="adv-cta-btn" onClick={() => navigate('/trips')}>Let's Plan Your Trip →</button>
              </div>
              <div className="adv-photo"><img src={ADV_NIGHT_SKY} alt="Night sky" /><div className="adv-caption"><p className="adv-cap-name">Night Sky Retreat</p><p className="adv-cap-loc">Ladakh, India</p></div></div>
            </div>
          </section>

          <section className="sec">
            <div className="sec-hd"><h2 className="sec-title">Your Upcoming Trips</h2><button className="view-all" onClick={() => navigate('/trips')}>View All →</button></div>
            {tripsLoading ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}><CircularProgress size={32} sx={{ color: 'var(--gold)' }} /></div>
            ) : upcomingTrips.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-3)' }}><span style={{ fontSize:40 }}>🗺️</span><p style={{ marginTop:10, fontSize:14 }}>No upcoming trips yet — <button style={{ background:'none',border:'none',cursor:'pointer',color:'var(--gold)',fontWeight:600,fontSize:14 }} onClick={() => navigate('/trips')}>plan one!</button></p></div>
            ) : (
              <div className="ut-layout">
                <div className="ut-main">
                  <div className="ut-img-wrap">
                    <img src={upcomingTrips[0].img || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80&auto=format&fit=crop'} alt={upcomingTrips[0].dest} className="ut-img" />
                    <div className="ut-img-overlay" /><div className="ut-img-info">
                      <p className="ut-dest">{upcomingTrips[0].dest}</p><p className="ut-dates">{upcomingTrips[0].dates}</p>
                      <div className="ut-meta"><span>📅 {upcomingTrips[0].days} Days Trip</span><span>👥 {upcomingTrips[0].members || 2} People</span></div>
                      <div className="ut-prog-wrap"><div className="ut-prog-bar"><div className="ut-prog-fill" style={{ width: `${upcomingTrips[0].progress}%` }} /></div><span className="ut-prog-pct">{upcomingTrips[0].progress}% Completed</span></div>
                    </div>
                  </div>
                </div>
                <div className="ut-side">
                  {upcomingTrips.slice(1).map((trip, i) => (
                    <div className="ut-row" key={i}>
                      <img src={trip.img || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80&auto=format&fit=crop'} alt={trip.dest} className="ut-row-img" />
                      <div className="ut-row-info"><p className="ut-row-dest">{trip.dest}</p><p className="ut-row-dates">{trip.dates}</p><p className="ut-row-meta">📅 {trip.days} Days Trip &nbsp;·&nbsp; 👥 {trip.members || 2} People</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="sec" style={{ marginBottom: 16 }}>
            <div className="sec-hd"><h2 className="sec-title">Travel Inspiration</h2><button className="view-all">View All →</button></div>
            <div className="blog-grid">
              {BLOG.map((b, i) => (
                <div className="blog-card" key={i}><img src={b.img} alt={b.title} className="blog-img" /><div className="blog-body"><p className="blog-title">{b.title}</p><p className="blog-desc">{b.desc}</p><div className="blog-footer"><span className="blog-date">{b.date}</span><button className="blog-arrow">→</button></div></div></div>
              ))}
            </div>
          </section>

          <div className="newsletter"><div className="newsletter-inner"><p className="nl-label">GET TRAVEL UPDATES</p><p className="nl-desc">Subscribe to receive travel tips, exclusive deals and inspiration straight to your inbox.</p><div className="nl-form"><input className="nl-input" placeholder="Enter your email" /><button className="nl-btn">SUBSCRIBE</button></div></div></div>
        </div>
      </div>
    </div>
  )
}
