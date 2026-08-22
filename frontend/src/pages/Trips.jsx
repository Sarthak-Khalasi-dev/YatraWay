import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { fetchTrips, createTrip, updateTrip, deleteTrip } from '../store/slices/tripSlice'
import { useToast } from '../context/ToastContext'
import { usePageTitle } from '../hooks/usePageTitle'
import './Trips.css'

const DEFAULT_INITIAL_JOURNEYS = [
  {
    _id: 'journey-agra-1',
    dest: 'Agra, India',
    statusTag: 'IN PROGRESS',
    dates: 'Oct 12 — Oct 20',
    days: 8,
    stops: '4 Stops',
    progress: 75,
    status: 'Upcoming',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=500&q=85&auto=format&fit=crop',
    subtitle: 'Golden Triangle & Mughal Heritage Odyssey',
    desc: 'Witness the sunrise over the Taj Mahal, explore the red sandstone courts of Agra Fort, and wander through ancient marble artisan workshops.',
  },
  {
    _id: 'journey-cinqueterre-2',
    dest: 'Cinque Terre, Italy',
    statusTag: 'DREAMING',
    dates: 'Dec 01 — Dec 10',
    days: 10,
    stops: '5 Villages',
    progress: 20,
    status: 'Upcoming',
    img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=500&q=85&auto=format&fit=crop',
    subtitle: 'Italian Riviera Coastal Cliff Trail',
    desc: 'Hike the iconic Sentiero Azzurro clifftop paths connecting Riomaggiore, Manarola, Corniglia, Vernazza, and Monterosso al Mare.',
  },
]

export default function Trips() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()

  usePageTitle('My Journeys — Wanderlust')

  const [filterTab, setFilterTab] = useState('Upcoming') // 'Upcoming' | 'Past'
  const [journeys, setJourneys] = useState(DEFAULT_INITIAL_JOURNEYS)
  const [selectedItineraryTrip, setSelectedItineraryTrip] = useState(null)
  const [showLogisticsModal, setShowLogisticsModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [menuOpenId, setMenuOpenId] = useState(null)

  // Form states for new trip
  const [newDest, setNewDest] = useState('')
  const [newDates, setNewDates] = useState('')
  const [newDays, setNewDays] = useState(7)
  const [newStops, setNewStops] = useState('3 Stops')
  const [newStatusTag, setNewStatusTag] = useState('DREAMING')
  const [newImg, setNewImg] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop')
  const [inviteEmail, setInviteEmail] = useState('')

  useEffect(() => {
    dispatch(fetchTrips())
    if (location.state?.initialDest) {
      const added = {
        _id: `journey-${Date.now()}`,
        dest: location.state.initialDest,
        statusTag: 'PLANNING',
        dates: 'Next Season',
        days: 7,
        stops: '3 Locations',
        progress: 10,
        status: 'Upcoming',
        img: location.state.initialImg || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80&auto=format&fit=crop',
        subtitle: 'Curated Custom Escape',
        desc: `Bespoke travel plan created for ${location.state.initialDest}.`,
      }
      setJourneys((prev) => [added, ...prev])
      toast.success(`✨ Added ${location.state.initialDest} to My Journeys!`)
      window.history.replaceState({}, document.title)
    }
  }, [dispatch, location.state])

  const handleCreateItinerary = (e) => {
    e.preventDefault()
    if (!newDest.trim()) return

    const newTripObj = {
      _id: `journey-${Date.now()}`,
      dest: newDest.trim(),
      statusTag: newStatusTag,
      dates: newDates || 'Nov 15 — Nov 22',
      days: parseInt(newDays) || 7,
      stops: newStops || '3 Stops',
      progress: 25,
      status: 'Upcoming',
      img: newImg,
      subtitle: 'Custom Crafted Journey',
      desc: `Explore the vibrant wonders and secret treasures of ${newDest.trim()}.`,
    }

    setJourneys((prev) => [...prev, newTripObj])
    setShowCreateModal(false)
    setNewDest('')
    setNewDates('')
    toast.success(`✈️ Itinerary for ${newTripObj.dest} created!`)
  }

  const handleDeleteJourney = (id) => {
    setJourneys((prev) => prev.filter((j) => j._id !== id))
    setMenuOpenId(null)
    toast.info('🗑️ Journey removed from your itineraries.')
  }

  const handleInviteCrew = (e) => {
    e.preventDefault()
    if (inviteEmail) {
      toast.success(`✉️ Invitation sent to ${inviteEmail}!`)
      setInviteEmail('')
    }
  }

  const handleShareItinerary = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('🔗 Shareable itinerary link copied to clipboard!')
    } else {
      toast.success('🔗 Itinerary ready to share!')
    }
  }

  const activeJourneysList = journeys.filter((j) =>
    filterTab === 'Upcoming' ? j.status !== 'Past' : j.status === 'Past'
  )

  return (
    <div className="trips-page-root">
      <Sidebar />

      <main className="trips-main-content">
        {/* ═════════════════════════════════════════════════════════════
            VIEW MODE A: MY JOURNEYS GRID (Matching Image 3)
        ═════════════════════════════════════════════════════════════ */}
        {!selectedItineraryTrip ? (
          <div className="trips-scroll-container">
            {/* Top Page Header */}
            <header className="journeys-top-header">
              <div className="journeys-title-group">
                <h1 className="journeys-hero-title">My Journeys</h1>
                <p className="journeys-hero-sub">
                  Manage your upcoming adventures and relive past memories across the globe with sophisticated ease.
                </p>
              </div>

              {/* Segmented Switcher (Upcoming / Past) */}
              <div className="journeys-tab-switcher">
                <button
                  className={`switcher-tab ${filterTab === 'Upcoming' ? 'active' : ''}`}
                  onClick={() => setFilterTab('Upcoming')}
                >
                  Upcoming
                </button>
                <button
                  className={`switcher-tab ${filterTab === 'Past' ? 'active' : ''}`}
                  onClick={() => setFilterTab('Past')}
                >
                  Past
                </button>
              </div>
            </header>

            {/* Journeys 2-Column Grid */}
            <div className="journeys-editorial-grid">
              {activeJourneysList.map((journey) => (
                <div key={journey._id} className="journey-card-editorial">
                  <div className="jc-image-container">
                    <img src={journey.img} alt={journey.dest} className="jc-cover-img" />
                    
                    {/* Status Badge */}
                    <div className="jc-status-badge">
                      <span className="status-dot" />
                      <span>{journey.statusTag || 'IN PROGRESS'}</span>
                    </div>

                    {/* Three Dots Menu */}
                    <div className="jc-menu-wrapper">
                      <button
                        className="jc-dots-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setMenuOpenId(menuOpenId === journey._id ? null : journey._id)
                        }}
                      >
                        ⋮
                      </button>

                      {menuOpenId === journey._id && (
                        <div className="jc-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setSelectedItineraryTrip(journey)
                              setMenuOpenId(null)
                            }}
                          >
                            📖 Open Itinerary
                          </button>
                          <button
                            onClick={() => {
                              setShowLogisticsModal(true)
                              setMenuOpenId(null)
                            }}
                          >
                            ✈️ Travel Logistics
                          </button>
                          <button
                            className="text-danger"
                            onClick={() => handleDeleteJourney(journey._id)}
                          >
                            🗑️ Delete Journey
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="jc-content-body">
                    <div className="jc-title-row">
                      <h3 className="jc-dest-title">{journey.dest}</h3>
                      <p className="jc-dates-lbl">{journey.dates}</p>
                    </div>

                    {/* Planning Progress Bar */}
                    <div className="jc-progress-box">
                      <div className="progress-lbl-row">
                        <span className="prog-title">Planning Progress</span>
                        <span className="prog-value">{journey.progress}%</span>
                      </div>
                      <div className="prog-track">
                        <div className="prog-fill" style={{ width: `${journey.progress}%` }} />
                      </div>
                    </div>

                    {/* Bottom Meta & Action */}
                    <div className="jc-footer-row">
                      <div className="jc-meta-items">
                        <span className="meta-pill">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {journey.days} Days
                        </span>

                        <span className="meta-pill">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {journey.stops || '4 Stops'}
                        </span>
                      </div>

                      <button
                        className="jc-view-plan-btn"
                        onClick={() => setSelectedItineraryTrip(journey)}
                      >
                        <span>View Plan</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Create New Itinerary Big Dashed Card */}
            <div className="create-itinerary-dashed-box" onClick={() => setShowCreateModal(true)}>
              <div className="create-plus-icon-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <h3 className="create-box-title">Create New Itinerary</h3>
              <p className="create-box-sub">Start planning your next unforgettable escape.</p>
            </div>
          </div>
        ) : (
          /* ═════════════════════════════════════════════════════════════
              VIEW MODE B: FULL ITINERARY VIEW (Matching Image 2)
          ═════════════════════════════════════════════════════════════ */
          <div className="itinerary-scroll-container">
            {/* Back Navigation */}
            <div className="itin-back-nav">
              <button className="itin-back-btn" onClick={() => setSelectedItineraryTrip(null)}>
                ← Back to My Journeys
              </button>
            </div>

            {/* 1. Hero Panorama with Frosted Glass Card */}
            <div className="itin-hero-panorama">
              <img
                src={selectedItineraryTrip.img || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=700&q=85&auto=format&fit=crop'}
                alt="Itinerary Cover"
                className="itin-hero-img"
              />
              <div className="itin-hero-overlay" />

              {/* Frosted Floating Card on Left */}
              <div className="itin-glass-card">
                <div className="glass-badge-row">
                  <span className="glass-badge-orange">ONGOING TRIP</span>
                  <span className="glass-days-left">8 Days left</span>
                </div>

                <h2 className="glass-card-title">
                  {selectedItineraryTrip.dest === 'Agra, India' ? 'Mughal Heritage of Agra' : 'Island of the Gods'}
                </h2>
                <p className="glass-card-desc">
                  {selectedItineraryTrip.desc || 'Explore the spiritual heart of Bali, from the lush jungles of Ubud to the pristine beaches of Uluwatu.'}
                </p>

                <div className="glass-actions-row">
                  <button className="glass-btn-white" onClick={handleShareItinerary}>
                    <span>Share with Friends</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </button>

                  <button className="glass-btn-outline" onClick={() => setShowLogisticsModal(true)}>
                    <span>View Logistics</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Main Itinerary Body: Daily Timeline + Sidebar Map/Crew */}
            <div className="itin-body-grid">
              {/* Left Column: Daily Itinerary Timeline */}
              <div className="itin-timeline-column">
                <div className="timeline-header-row">
                  <h3 className="itin-section-h3">Daily Itinerary</h3>
                  <div className="timeline-page-arrows">
                    <button className="t-arrow-btn">‹</button>
                    <button className="t-arrow-btn">›</button>
                  </div>
                </div>

                {/* Day 01 Card */}
                <div className="day-schedule-card">
                  <div className="day-number-badge">01</div>
                  <div className="day-content-area">
                    <div className="day-title-row">
                      <div>
                        <h4 className="day-headline">
                          {selectedItineraryTrip.dest === 'Agra, India' ? 'Taj Mahal Sunrise & Red Fort Exploration' : 'Ubud Arrival & Temple Visit'}
                        </h4>
                        <p className="day-sub-location">Tuesday, Oct 24 • Spiritual Center</p>
                      </div>
                      <span className="day-compass-icon">🧭</span>
                    </div>

                    <div className="day-events-list">
                      <div className="day-event-item">
                        <div className="event-icon-box">🍴</div>
                        <div className="event-details">
                          <h5 className="event-name">
                            {selectedItineraryTrip.dest === 'Agra, India' ? 'Royal Mughlai Lunch at Peshawri' : 'Lunch at Ibu Rai'}
                          </h5>
                          <p className="event-desc">
                            {selectedItineraryTrip.dest === 'Agra, India' ? 'Authentic tandoori delicacies and saffron biryani.' : 'Traditional Balinese organic cuisine and tropical herbal teas.'}
                          </p>
                        </div>
                        <span className="event-time">12:30 PM</span>
                      </div>

                      <div className="day-event-item">
                        <div className="event-icon-box">🚶</div>
                        <div className="event-details">
                          <h5 className="event-name">
                            {selectedItineraryTrip.dest === 'Agra, India' ? 'Agra Fort Diwan-i-Khas Heritage Walk' : 'Sacred Monkey Forest Sanctuary'}
                          </h5>
                          <p className="event-desc">
                            {selectedItineraryTrip.dest === 'Agra, India' ? 'Private architectural walk through Emperor Shah Jahan’s marble chambers.' : 'Guided walk through ancient jungle temples and sacred banyan trees.'}
                          </p>
                        </div>
                        <span className="event-time">03:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day 02 Card */}
                <div className="day-schedule-card">
                  <div className="day-number-badge">02</div>
                  <div className="day-content-area">
                    <div className="day-title-row">
                      <div>
                        <h4 className="day-headline">
                          {selectedItineraryTrip.dest === 'Agra, India' ? 'Fatehpur Sikri & Artisan Marble Inlay' : 'Sunsets & Coastal Cliffs'}
                        </h4>
                        <p className="day-sub-location">Wednesday, Oct 25 • Uluwatu Coast</p>
                      </div>
                      <span className="day-compass-icon">🏖️</span>
                    </div>

                    <div className="day-events-list">
                      <div className="day-event-item">
                        <div className="event-icon-box">🌊</div>
                        <div className="event-details">
                          <h5 className="event-name">
                            {selectedItineraryTrip.dest === 'Agra, India' ? 'Mehtab Bagh Moonlight River Walk' : 'Padang Padang Beach Surf'}
                          </h5>
                          <p className="event-desc">
                            {selectedItineraryTrip.dest === 'Agra, India' ? 'Sunset view of the Taj Mahal across the calm waters of the Yamuna.' : 'Morning surf session and cliffside relaxation overlooking crystal reef waters.'}
                          </p>
                        </div>
                        <span className="event-time">09:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Route Map, Travel Crew & Logistics Box */}
              <div className="itin-sidebar-column">
                {/* Route Map Card */}
                <div className="itin-map-box">
                  <div className="map-hdr-row">
                    <span className="map-lbl">ROUTE MAP</span>
                    <span className="map-count">📍 4 Locations</span>
                  </div>

                  <div className="map-graphic-viewport">
                    <svg viewBox="0 0 300 180" className="bali-map-svg">
                      <path
                        d="M20,90 Q60,40 130,50 T220,70 T280,110 Q260,150 180,140 T80,130 Z"
                        fill="#A8A29E"
                        opacity="0.85"
                      />
                      <circle cx="160" cy="95" r="4" fill="#000000" />
                      <circle cx="160" cy="95" r="10" fill="rgba(0,0,0,0.15)" />
                      {/* Tooltip Label */}
                      <g transform="translate(130, 65)">
                        <rect width="65" height="22" rx="4" fill="#18181B" />
                        <text x="7" y="15" fill="#FFFFFF" fontSize="9" fontWeight="700">
                          Ubud Base
                        </text>
                      </g>
                    </svg>

                    <div className="map-zoom-controls">
                      <button className="zoom-btn">+</button>
                      <button className="zoom-btn">−</button>
                    </div>
                  </div>
                </div>

                {/* Travel Crew Obsidian Box */}
                <div className="itin-crew-card">
                  <h4 className="crew-title">Travel Crew</h4>
                  <p className="crew-sub">Manage who can view and edit this itinerary.</p>

                  <div className="crew-members-list">
                    <div className="crew-member-row">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&q=80&auto=format&fit=crop"
                        alt="Sarah Jenkins"
                        className="crew-avatar"
                      />
                      <div className="crew-info">
                        <span className="crew-name">Sarah Jenkins</span>
                        <span className="crew-role">TRIP OWNER</span>
                      </div>
                    </div>

                    <div className="crew-member-row">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&q=80&auto=format&fit=crop"
                        alt="Mark Davis"
                        className="crew-avatar"
                      />
                      <div className="crew-info">
                        <span className="crew-name">Mark Davis</span>
                        <span className="crew-role">CAN EDIT</span>
                      </div>
                    </div>
                  </div>

                  <form className="crew-invite-row" onSubmit={handleInviteCrew}>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="crew-input"
                    />
                    <button type="submit" className="crew-invite-btn">
                      Invite
                    </button>
                  </form>
                </div>

                {/* Trip Logistics Summary Pill Box */}
                <div className="itin-logistics-summary-box" onClick={() => setShowLogisticsModal(true)}>
                  <span className="log-hdr-lbl">TRIP LOGISTICS</span>

                  <div className="log-item-line">
                    <span className="log-icon">✈️</span>
                    <div>
                      <p className="log-name">Flight MH-842</p>
                      <p className="log-sub">Arriving 02:45 PM</p>
                    </div>
                  </div>

                  <div className="log-item-line">
                    <span className="log-icon">🏨</span>
                    <div>
                      <p className="log-name">Mandapa Reserve</p>
                      <p className="log-sub">Check-in at 03:00 PM</p>
                    </div>
                  </div>

                  <div className="log-item-line">
                    <span className="log-icon">🛡️</span>
                    <div>
                      <p className="log-name">Travel Insurance</p>
                      <p className="log-sub">Active • NomadCare</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            TRAVEL LOGISTICS MODAL / DRAWER (Matching Image 1)
        ═════════════════════════════════════════════════════════════ */}
        {showLogisticsModal && (
          <div className="logistics-modal-backdrop" onClick={() => setShowLogisticsModal(false)}>
            <div className="logistics-drawer-window" onClick={(e) => e.stopPropagation()}>
              {/* Left Photo Showcase */}
              <div className="log-drawer-left-photo">
                <img
                  src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=1100&q=85&auto=format&fit=crop"
                  alt="Bali Stay"
                  className="log-photo-bg"
                />
                <div className="log-photo-gradient" />
                <div className="log-photo-caption">
                  <span className="log-days-tag">DAYS TO GO: 12</span>
                  <h3 className="log-photo-title">Bali Itinerary</h3>
                  <p className="log-photo-sub">
                    Your spiritual journey through the heart of Ubud begins with seamless transitions and refined comfort.
                  </p>
                </div>
              </div>

              {/* Right Logistics Detail Column */}
              <div className="log-drawer-right-details">
                <div className="log-drawer-header">
                  <div>
                    <h2 className="log-main-title">Travel Logistics</h2>
                    <p className="log-main-sub">ARRIVAL & STAY DETAILS</p>
                  </div>
                  <button className="log-close-btn" onClick={() => setShowLogisticsModal(false)}>
                    ✕
                  </button>
                </div>

                <div className="log-cards-stack">
                  {/* Card 1: Arrival Flight */}
                  <div className="log-detail-card">
                    <div className="log-card-row1">
                      <div className="log-badge-icon dark">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                          <path d="M22 2L11 13" />
                          <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                      </div>
                      <div>
                        <span className="log-card-type">ARRIVAL FLIGHT</span>
                        <h4 className="log-card-name">Flight MH-842</h4>
                      </div>
                      <div className="log-card-meta-right">
                        <span className="meta-terminal">Terminal 3</span>
                        <span className="meta-gate">GATE B12</span>
                      </div>
                    </div>

                    <div className="log-card-row2">
                      <div>
                        <span className="row2-lbl">SCHEDULED ARRIVAL</span>
                        <span className="row2-val">02:45 PM</span>
                      </div>
                      <div>
                        <span className="row2-lbl">ORIGIN</span>
                        <span className="row2-val">Kuala Lumpur (KUL)</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Accommodation */}
                  <div className="log-detail-card">
                    <div className="log-card-row1">
                      <div className="log-badge-icon beige">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth="2">
                          <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
                        </svg>
                      </div>
                      <div>
                        <span className="log-card-type">ACCOMMODATION</span>
                        <h4 className="log-card-name">Mandapa Reserve</h4>
                      </div>
                      <div className="log-card-meta-right">
                        <span className="meta-luxury">★ LUXURY</span>
                      </div>
                    </div>

                    <p className="log-location-text">📍 Ubud, Gianyar, Bali</p>

                    <div className="log-card-row2">
                      <div>
                        <span className="row2-lbl">CHECK-IN TIME</span>
                        <span className="row2-val">03:00 PM</span>
                      </div>
                      <button
                        className="log-view-details-link"
                        onClick={() => navigate('/bookings')}
                      >
                        VIEW DETAILS →
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Travel Insurance */}
                  <div className="log-detail-card">
                    <div className="log-card-row1">
                      <div className="log-badge-icon beige">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div>
                        <div className="insurance-title-row">
                          <span className="log-card-type">TRAVEL INSURANCE</span>
                          <span className="insurance-active-pill">ACTIVE</span>
                        </div>
                        <h4 className="log-card-name">NomadCare Premium</h4>
                      </div>
                      <div className="log-card-meta-right">
                        <span className="row2-lbl">POLICY #</span>
                        <span className="policy-val">NC-789210-BL</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="log-actions-column">
                  <button
                    className="log-btn-primary"
                    onClick={() => toast.success('📥 Digital Travel Vouchers downloaded!')}
                  >
                    <span>DOWNLOAD DIGITAL VOUCHERS</span>
                    <span>→</span>
                  </button>

                  <button
                    className="log-btn-secondary"
                    onClick={() => navigate('/messages')}
                  >
                    <span>💬</span>
                    <span>CONTACT TRAVEL CONCIERGE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            CREATE ITINERARY MODAL
        ═════════════════════════════════════════════════════════════ */}
        {showCreateModal && (
          <div className="create-modal-backdrop" onClick={() => setShowCreateModal(false)}>
            <div className="create-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="create-modal-hdr">
                <h3 className="create-modal-title">Create New Journey Itinerary</h3>
                <button className="create-modal-close" onClick={() => setShowCreateModal(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateItinerary} className="create-modal-form">
                <div className="cm-field">
                  <label>Destination & Region *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kyoto, Japan or Ladakh, India"
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                  />
                </div>

                <div className="cm-grid-2">
                  <div className="cm-field">
                    <label>Trip Dates</label>
                    <input
                      type="text"
                      placeholder="e.g. Oct 15 — Oct 24"
                      value={newDates}
                      onChange={(e) => setNewDates(e.target.value)}
                    />
                  </div>

                  <div className="cm-field">
                    <label>Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="7"
                      value={newDays}
                      onChange={(e) => setNewDays(e.target.value)}
                    />
                  </div>
                </div>

                <div className="cm-grid-2">
                  <div className="cm-field">
                    <label>Number of Stops / Villages</label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Stops"
                      value={newStops}
                      onChange={(e) => setNewStops(e.target.value)}
                    />
                  </div>

                  <div className="cm-field">
                    <label>Status Tag</label>
                    <select
                      value={newStatusTag}
                      onChange={(e) => setNewStatusTag(e.target.value)}
                    >
                      <option value="IN PROGRESS">IN PROGRESS</option>
                      <option value="DREAMING">DREAMING</option>
                      <option value="PLANNING">PLANNING</option>
                    </select>
                  </div>
                </div>

                <div className="cm-field">
                  <label>Cover Photo URL</label>
                  <input
                    type="url"
                    value={newImg}
                    onChange={(e) => setNewImg(e.target.value)}
                  />
                </div>

                <div className="cm-actions">
                  <button
                    type="button"
                    className="cm-btn-cancel"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="cm-btn-submit">
                    Create Itinerary
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
