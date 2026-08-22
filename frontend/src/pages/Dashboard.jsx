import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'
import { fetchTrips } from '../store/slices/tripSlice'
import { usePageTitle } from '../hooks/usePageTitle'
import './Dashboard.css'

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [liked, setLiked] = useState({})
  const [search, setSearch] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)

  usePageTitle('Dashboard — Wanderlust')

  const displayName = userInfo?.name || 'Ananya'
  const firstName = displayName.split(' ')[0]

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40)
    dispatch(fetchTrips())
    return () => clearTimeout(t)
  }, [dispatch])

  const toggleHeart = (e, id) => {
    e.stopPropagation()
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate('/destinations', { state: { search: search.trim() } })
    }
  }

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (newsletterEmail) {
      setNewsletterSuccess(true)
      setTimeout(() => {
        setNewsletterEmail('')
        setNewsletterSuccess(false)
      }, 4000)
    }
  }

  return (
    <div className={`db-root ${mounted ? 'db-on' : ''}`}>
      {/* ── SIDEBAR ── */}
      <Sidebar />

      {/* ── MAIN CONTENT ── */}
      <div className="db-main">
        {/* ── TOP HEADER ── */}
        <header className="db-topbar">
          <form className="db-search-form" onSubmit={handleSearchSubmit}>
            <div className="db-search-box">
              <svg className="db-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C867A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="db-search-input"
                placeholder="Search destinations, experiences..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="db-search-submit">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </form>

          <div className="db-topbar-right">
            <button className="db-notif-btn" title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="db-notif-dot" />
            </button>

            <div className="db-user-chip" onClick={() => navigate('/profile')}>
              <img
                src={userInfo?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&q=80&auto=format&fit=crop'}
                className="db-user-avatar"
                alt="Profile"
              />
              <div className="db-user-info">
                <p className="db-user-name">Hi, {firstName}</p>
                <p className="db-user-sub">Explorer <span>▾</span></p>
              </div>
            </div>
          </div>
        </header>

        {/* ── SCROLLABLE DASHBOARD BODY ── */}
        <div className="db-scroll-body">
          {/* 1. HERO SECTION */}
          <section className="db-hero-section">
            <div className="db-hero-content">
              <div className="db-hero-text">
                <h1 className="db-hero-h1">
                  <span>EXPLORE</span>
                  <span>MORE</span>
                  <span>LIVE MORE</span>
                </h1>
                <p className="db-hero-cursive">The world is waiting for you</p>
                <button className="db-hero-planner-btn" onClick={() => navigate('/destinations')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>Start Travel Planner</span>
                  <span className="hero-btn-arrow">→</span>
                </button>
              </div>

              {/* Collect Moments Badge */}
              <div className="db-collect-badge">
                <span className="badge-star">★</span>
                <span className="badge-text">COLLECT<br />MOMENTS</span>
              </div>

              {/* Tilted Travel Postcard Cards */}
              <div className="db-hero-cards">
                <div className="db-hero-card-tilt card-tilt-1">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=700&q=80&auto=format&fit=crop"
                    alt="Valley Escapes"
                  />
                </div>
                <div className="db-hero-card-tilt card-tilt-2">
                  <img
                    src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=700&q=80&auto=format&fit=crop"
                    alt="Scenic Mountain Lake"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 2. LOCATION & NEXT TRIP BAR */}
          <section className="db-widget-bar">
            <div className="widget-loc-item">
              <div className="widget-icon-box orange">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="widget-lbl">Current Location</p>
                <p className="widget-val">Bangalore, India</p>
              </div>
            </div>

            {/* Center Creative Travel Planner Button */}
            <button
              className="widget-center-cta-btn"
              onClick={() => navigate('/destinations')}
              title="Start Travel Planner"
            >
              <div className="cta-icon-spin">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
              <span className="cta-btn-text">START PLANNER</span>
              <span className="cta-arrow">→</span>
            </button>

            <div className="widget-trip-item">
              <div>
                <p className="widget-lbl">Your Next Trip</p>
                <p className="widget-val">Bali, Indonesia</p>
              </div>
              <div className="widget-cal-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div>
                  <span className="cal-sub">Upcoming Trip</span>
                  <span className="cal-days">12 Days to go</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. RECOMMENDED FOR YOU */}
          <section className="db-section">
            <div className="db-section-hdr">
              <h2 className="db-section-title">Recommended For You</h2>
              <button className="db-view-all" onClick={() => navigate('/destinations')}>
                View All →
              </button>
            </div>

            <div className="db-rec-grid">
              {/* Card 1: Maldives */}
              <div className="rec-card" onClick={() => navigate('/destinations')}>
                <div className="rec-img-wrap">
                  <img src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&h=420&q=80&auto=format&fit=crop" alt="Maldives" />
                  <button className={`rec-heart-btn ${liked['maldives'] ? 'active' : ''}`} onClick={(e) => toggleHeart(e, 'maldives')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={liked['maldives'] ? '#EF4444' : 'none'} stroke={liked['maldives'] ? '#EF4444' : '#FFFFFF'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="rec-body">
                  <h3 className="rec-name">Maldives</h3>
                  <p className="rec-tag">Paradise on Earth</p>
                  <p className="rec-rating"><span className="star">★</span> 4.8 <span className="reviews">(320 reviews)</span></p>
                </div>
              </div>

              {/* Card 2: Switzerland */}
              <div className="rec-card" onClick={() => navigate('/destinations')}>
                <div className="rec-img-wrap">
                  <img src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=500&h=420&q=80&auto=format&fit=crop" alt="Switzerland" />
                  <button className={`rec-heart-btn ${liked['swiss'] ? 'active' : ''}`} onClick={(e) => toggleHeart(e, 'swiss')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={liked['swiss'] ? '#EF4444' : 'none'} stroke={liked['swiss'] ? '#EF4444' : '#FFFFFF'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="rec-body">
                  <h3 className="rec-name">Switzerland</h3>
                  <p className="rec-tag">Alpine Wonderland</p>
                  <p className="rec-rating"><span className="star">★</span> 4.9 <span className="reviews">(180 reviews)</span></p>
                </div>
              </div>

              {/* Card 3: Greece */}
              <div className="rec-card" onClick={() => navigate('/destinations')}>
                <div className="rec-img-wrap">
                  <img src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500&h=420&q=80&auto=format&fit=crop" alt="Greece" />
                  <button className={`rec-heart-btn ${liked['greece'] ? 'active' : ''}`} onClick={(e) => toggleHeart(e, 'greece')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={liked['greece'] ? '#EF4444' : 'none'} stroke={liked['greece'] ? '#EF4444' : '#FFFFFF'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="rec-body">
                  <h3 className="rec-name">Greece</h3>
                  <p className="rec-tag">Timeless Beauty</p>
                  <p className="rec-rating"><span className="star">★</span> 4.7 <span className="reviews">(210 reviews)</span></p>
                </div>
              </div>

              {/* Card 4: Bali */}
              <div className="rec-card" onClick={() => navigate('/destinations')}>
                <div className="rec-img-wrap">
                  <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&h=420&q=80&auto=format&fit=crop" alt="Bali" />
                  <button className={`rec-heart-btn ${liked['bali'] ? 'active' : ''}`} onClick={(e) => toggleHeart(e, 'bali')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={liked['bali'] ? '#EF4444' : 'none'} stroke={liked['bali'] ? '#EF4444' : '#FFFFFF'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="rec-body">
                  <h3 className="rec-name">Bali</h3>
                  <p className="rec-tag">Island of Gods</p>
                  <p className="rec-rating"><span className="star">★</span> 4.8 <span className="reviews">(420 reviews)</span></p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. PLAN YOUR NEXT ADVENTURE */}
          <section className="db-section">
            <h2 className="db-section-title">Plan Your Next Adventure</h2>

            <div className="db-adv-grid">
              {/* Left Big Card with Split Graphic and Form CTA */}
              <div className="adv-left-card">
                <div className="adv-graphic-half">
                  <svg viewBox="0 0 400 300" className="mountain-vector-svg">
                    <rect width="400" height="300" fill="#0C1B2A" />
                    {/* Stars */}
                    <circle cx="40" cy="30" r="1.5" fill="#FFFFFF" opacity="0.6" />
                    <circle cx="120" cy="45" r="1" fill="#FFFFFF" opacity="0.8" />
                    <circle cx="280" cy="35" r="1.2" fill="#FFFFFF" opacity="0.7" />
                    <circle cx="340" cy="60" r="1" fill="#FFFFFF" opacity="0.5" />
                    <circle cx="200" cy="20" r="1.8" fill="#FFFFFF" opacity="0.9" />
                    {/* Distant Mountains */}
                    <polygon points="0,300 80,180 180,300" fill="#183654" />
                    <polygon points="120,300 240,140 360,300" fill="#244D76" />
                    <polygon points="260,300 330,190 400,300" fill="#1C3D5E" />
                    {/* Snow Caps */}
                    <polygon points="240,140 215,180 240,172 265,180" fill="#E2E8F0" />
                    <polygon points="80,180 60,210 80,205 100,210" fill="#CBD5E1" />
                    {/* Foreground Pine Ridge */}
                    <polygon points="0,300 50,240 100,300 150,250 200,300 280,245 350,300 400,255 400,300" fill="#0B131F" />
                  </svg>
                </div>

                <div className="adv-content-half">
                  <h3 className="adv-h3">Plan your dream<br />trip today!</h3>
                  <p className="adv-sub">Tell us your preferences and we'll craft the perfect journey for you.</p>

                  <div className="adv-steps-row">
                    <div className="adv-step-item">
                      <div className="adv-step-icon">○</div>
                      <span className="adv-step-lbl">CHOOSE DESTINATION</span>
                    </div>
                    <div className="adv-step-item">
                      <div className="adv-step-icon">📅</div>
                      <span className="adv-step-lbl">SELECT DATES</span>
                    </div>
                    <div className="adv-step-item">
                      <div className="adv-step-icon">✈️</div>
                      <span className="adv-step-lbl">TRAVEL STYLE</span>
                    </div>
                  </div>

                  <button className="adv-cta-btn" onClick={() => navigate('/trips')}>
                    <span>Let's Plan Your Trip</span>
                    <span className="adv-arrow">→</span>
                  </button>
                </div>
              </div>

              {/* Right Card with Quote & Watermark */}
              <div className="adv-right-quote-card">
                <div className="quote-watermark-bg">
                  <svg viewBox="0 0 200 150" className="watermark-svg">
                    <polygon points="0,150 70,80 140,150" fill="#EFEAE2" opacity="0.6" />
                    <polygon points="80,150 140,60 200,150" fill="#E5DFD5" opacity="0.7" />
                  </svg>
                </div>
                <div className="adv-quote-wrapper">
                  <p className="adv-quote-text">
                    "One day you'll leave this world behind<br />so live a life you will remember."
                  </p>
                  <span className="adv-quote-author">~ The Nights</span>
                </div>
              </div>
            </div>
          </section>

          {/* 5. YOUR UPCOMING TRIPS */}
          <section className="db-section">
            <div className="db-section-hdr">
              <h2 className="db-section-title">Your Upcoming Trips</h2>
              <button className="db-view-all" onClick={() => navigate('/trips')}>
                View All →
              </button>
            </div>

            <div className="db-upcoming-layout">
              {/* Main Feature Trip: Bali */}
              <div className="upcoming-main-card" onClick={() => navigate('/trips')}>
                <div className="upcoming-img-box">
                  <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=450&q=80&auto=format&fit=crop" alt="Bali" />
                </div>
                <div className="upcoming-main-info">
                  <div>
                    <h3 className="upcoming-main-title">Bali, Indonesia</h3>
                    <p className="upcoming-dates">20 May - 02 June 2024</p>
                  </div>

                  <div className="upcoming-meta-row">
                    <span>📅 12 Days Trip</span>
                    <span>👥 2 People</span>
                  </div>

                  <div className="upcoming-progress-wrap">
                    <span className="prog-label">80% Completed</span>
                    <div className="prog-bar-bg">
                      <div className="prog-bar-fill" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Mini Trips */}
              <div className="upcoming-side-list">
                <div className="upcoming-side-item" onClick={() => navigate('/trips')}>
                  <div className="side-thumb-box">
                    <img src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=160&h=160&q=80&auto=format&fit=crop" alt="Switzerland" />
                  </div>
                  <div className="side-item-info">
                    <h4 className="side-item-title">Switzerland</h4>
                    <p className="side-item-dates">05 July - 15 July 2024</p>
                    <p className="side-item-meta">📅 10 Days &nbsp;·&nbsp; 👥 2 People</p>
                  </div>
                </div>

                <div className="upcoming-side-item" onClick={() => navigate('/trips')}>
                  <div className="side-thumb-box">
                    <img src="https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=160&h=160&q=80&auto=format&fit=crop" alt="Thailand" />
                  </div>
                  <div className="side-item-info">
                    <h4 className="side-item-title">Thailand</h4>
                    <p className="side-item-dates">10 Aug - 25 Aug 2024</p>
                    <p className="side-item-meta">📅 7 Days &nbsp;·&nbsp; 👥 2 People</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. TRAVEL INSPIRATION */}
          <section className="db-section">
            <div className="db-section-hdr">
              <h2 className="db-section-title">Travel Inspiration</h2>
              <button className="db-view-all" onClick={() => navigate('/experiences')}>
                View All →
              </button>
            </div>

            <div className="db-blog-grid">
              <div className="blog-article-card" onClick={() => navigate('/experiences')}>
                <img src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&q=85&auto=format&fit=crop" alt="Cappadocia" className="blog-card-img" />
                <div className="blog-card-body">
                  <h4 className="blog-card-title">A Complete Guide to Cappadocia</h4>
                  <p className="blog-card-desc">Discover the magical land of hot air balloons.</p>
                  <span className="blog-card-date">April 20, 2024</span>
                </div>
              </div>

              <div className="blog-article-card" onClick={() => navigate('/experiences')}>
                <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&q=85&auto=format&fit=crop" alt="Coastal Towns" className="blog-card-img" />
                <div className="blog-card-body">
                  <h4 className="blog-card-title">10 Most Beautiful Coastal Towns</h4>
                  <p className="blog-card-desc">Stunning views and relaxing vibes.</p>
                  <span className="blog-card-date">May 15, 2024</span>
                </div>
              </div>

              <div className="blog-article-card" onClick={() => navigate('/experiences')}>
                <img src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&h=400&q=85&auto=format&fit=crop" alt="Hidden Gems in Asia" className="blog-card-img" />
                <div className="blog-card-body">
                  <h4 className="blog-card-title">Top 7 Hidden Gems in Asia</h4>
                  <p className="blog-card-desc">Offbeat places you must explore.</p>
                  <span className="blog-card-date">June 18, 2024</span>
                </div>
              </div>
            </div>
          </section>

          {/* 7. NEWSLETTER BANNER */}
          <section className="db-newsletter-box">
            <div className="nl-stamp-left">
              <div className="vintage-postmark">
                <span>PASSPORT</span>
                <span>VERIFIED</span>
                <span>2026</span>
              </div>
            </div>

            <div className="nl-content-center">
              <h3 className="nl-heading">GET TRAVEL UPDATES</h3>
              <p className="nl-desc">Subscribe to receive travel tips, exclusive deals and inspiration straight to your inbox.</p>
              
              <form className="nl-form-row" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  className="nl-input-field"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit" className="nl-submit-btn">
                  {newsletterSuccess ? 'SUBSCRIBED! ✓' : 'SUBSCRIBE'}
                </button>
              </form>
            </div>

            <div className="nl-stamp-right">
              <div className="vintage-seal-circle">
                <span>YATRAWAY</span>
                <span>TRAVEL</span>
                <span>III</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
