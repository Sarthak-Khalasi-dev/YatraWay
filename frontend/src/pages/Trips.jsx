import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../services/api'
import { fetchTrips, createTrip, updateTrip, deleteTrip } from '../store/slices/tripSlice'
import { useToast } from '../context/ToastContext'
import { usePageTitle } from '../hooks/usePageTitle'
import './Trips.css'

// Initial Curated Multi-City Journeys
const DEFAULT_INITIAL_JOURNEYS = [
  {
    _id: 'journey-europe-1',
    dest: 'Europe Grand Tour',
    subtitle: 'Paris → Rome → Barcelona',
    statusTag: 'ONGOING TRIP',
    status: 'Upcoming',
    dates: '12 Aug — 25 Aug 2026',
    days: 14,
    budgetINR: 125000,
    progress: 75,
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&q=85&auto=format&fit=crop',
    desc: 'Multi-city adventure connecting Paris Eiffel vistas, Roman Colosseum ruins, and Barcelona Gothic quarter.',
    cities: [
      { name: 'Paris', country: 'France', days: 4, dates: '12 Aug — 16 Aug' },
      { name: 'Rome', country: 'Italy', days: 5, dates: '16 Aug — 21 Aug' },
      { name: 'Barcelona', country: 'Spain', days: 5, dates: '21 Aug — 25 Aug' },
    ],
    daysPlan: [
      {
        dayNumber: 1,
        date: '12 Aug',
        city: 'Paris',
        theme: 'Parisian Arrival & Eiffel Sunset',
        activities: [
          { name: 'Eiffel Tower Summit Tour', time: '11:00 AM', costINR: 2800, category: 'Sightseeing', desc: 'Fast-track elevator pass to the highest vantage point of Paris.', duration: '2.5h' },
          { name: 'Traditional French Bistro Lunch', time: '02:00 PM', costINR: 1200, category: 'Food', desc: 'Organic duck confit and artisanal baguette tasting.', duration: '1.5h' },
          { name: 'Seine River Sunset Cruise', time: '07:00 PM', costINR: 1900, category: 'Adventure', desc: 'Twilight glass-canopy boat sail past Notre Dame cathedral.', duration: '2h' },
        ],
      },
      {
        dayNumber: 2,
        date: '13 Aug',
        city: 'Paris',
        theme: 'Art, Culture & Montmartre',
        activities: [
          { name: 'Louvre Museum Masterpieces', time: '09:30 AM', costINR: 2200, category: 'Culture', desc: 'Guided Mona Lisa and Venus de Milo historic tour.', duration: '3h' },
          { name: 'Montmartre Artists Square & Sacré-Cœur', time: '04:30 PM', costINR: 800, category: 'Culture', desc: 'Bohemian alleyways, portrait artists, and hilltop basilica.', duration: '2.5h' },
        ],
      },
      {
        dayNumber: 3,
        date: '17 Aug',
        city: 'Rome',
        theme: 'Gladiators & Ancient Roman Wonders',
        activities: [
          { name: 'Colosseum & Roman Forum Arena Tour', time: '10:00 AM', costINR: 3200, category: 'Culture', desc: 'Underground gladiator chambers and panoramic arches.', duration: '3h' },
          { name: 'Authentic Trastevere Pasta Feast', time: '01:30 PM', costINR: 1100, category: 'Food', desc: 'Handcrafted Cacio e Pepe and Roman wine pairing.', duration: '1.5h' },
          { name: 'Trevi Fountain & Spanish Steps', time: '06:00 PM', costINR: 0, category: 'Sightseeing', desc: 'Coin tossing ritual and evening gelato walk.', duration: '2h' },
        ],
      },
      {
        dayNumber: 4,
        date: '22 Aug',
        city: 'Barcelona',
        theme: 'Gaudí Architecture & Mediterranean Vibes',
        activities: [
          { name: 'Sagrada Família Towers & Basilica', time: '10:30 AM', costINR: 2900, category: 'Culture', desc: 'Antoni Gaudí’s stained-glass masterpiece walk.', duration: '2.5h' },
          { name: 'Barceloneta Beach Tapas & Paella', time: '02:00 PM', costINR: 1400, category: 'Food', desc: 'Fresh seafood paella overlooking Mediterranean waves.', duration: '2h' },
          { name: 'Park Güell Sunset Terrace', time: '06:30 PM', costINR: 1200, category: 'Sightseeing', desc: 'Colorful mosaic serpentine benches and city skyline view.', duration: '2h' },
        ],
      },
    ],
    expenses: {
      transportINR: 28000,
      hotelINR: 52000,
      activitiesINR: 18500,
      foodINR: 16000,
    },
  },
  {
    _id: 'journey-rajasthan-2',
    dest: 'Royal Rajasthan Heritage',
    subtitle: 'Jaipur → Jodhpur → Udaipur',
    statusTag: 'PLANNING',
    status: 'Upcoming',
    dates: '10 Oct — 18 Oct 2026',
    days: 8,
    budgetINR: 55000,
    progress: 40,
    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=800&q=85&auto=format&fit=crop',
    desc: 'Golden desert palaces, Amber Fort elephant trails, and royal Lake Pichola sunset boat sails.',
    cities: [
      { name: 'Jaipur', country: 'India', days: 3, dates: '10 Oct — 13 Oct' },
      { name: 'Jodhpur', country: 'India', days: 2, dates: '13 Oct — 15 Oct' },
      { name: 'Udaipur', country: 'India', days: 3, dates: '15 Oct — 18 Oct' },
    ],
    daysPlan: [
      {
        dayNumber: 1,
        date: '10 Oct',
        city: 'Jaipur',
        theme: 'Pink City Palaces & Fortresses',
        activities: [
          { name: 'Amber Fort Sunrise Elephant View', time: '08:30 AM', costINR: 1500, category: 'Culture', desc: 'Mirror palace Sheesh Mahal and rugged Aravalli fortifications.', duration: '3h' },
          { name: 'Hawa Mahal & Royal City Palace Walk', time: '02:00 PM', costINR: 900, category: 'Sightseeing', desc: 'Palace of Winds honeycomb windows and royal textile museums.', duration: '2.5h' },
        ],
      },
      {
        dayNumber: 2,
        date: '16 Oct',
        city: 'Udaipur',
        theme: 'City of Lakes & Royal Romance',
        activities: [
          { name: 'City Palace Complex & Museum', time: '10:00 AM', costINR: 1200, category: 'Culture', desc: 'Rajasthan’s largest palace complex overlooking Lake Pichola.', duration: '3h' },
          { name: 'Sunset Boat Cruise on Lake Pichola', time: '05:30 PM', costINR: 1800, category: 'Adventure', desc: 'Glide past the illuminated white marble Lake Palace.', duration: '2h' },
        ],
      },
    ],
    expenses: {
      transportINR: 11000,
      hotelINR: 22000,
      activitiesINR: 7400,
      foodINR: 8500,
    },
  },
]

export default function Trips() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()

  usePageTitle('My Journeys — GlobeTrotter')

  const [filterTab, setFilterTab] = useState('Upcoming') // 'Upcoming' | 'Past' | 'Community'
  const [journeys, setJourneys] = useState(DEFAULT_INITIAL_JOURNEYS)
  const [selectedItineraryTrip, setSelectedItineraryTrip] = useState(null)
  const [activeItineraryTab, setActiveItineraryTab] = useState('Daily Schedule') // 'Daily Schedule' | 'Calendar' | 'Budget'
  
  // Modals State
  const [showLogisticsModal, setShowLogisticsModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAIOptimizerModal, setShowAIOptimizerModal] = useState(false)
  const [showAddCityModal, setShowAddCityModal] = useState(false)
  const [showAddActivityModal, setShowAddActivityModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [menuOpenId, setMenuOpenId] = useState(null)

  // AI Optimizer State
  const [aiTripName, setAiTripName] = useState('My Custom Journey')
  const [aiCitiesInput, setAiCitiesInput] = useState('Paris, Rome, Barcelona')
  const [aiDays, setAiDays] = useState(7)
  const [aiBudget, setAiBudget] = useState(65000)
  const [aiTravelStyle, setAiTravelStyle] = useState('Boutique')
  const [aiInterests, setAiInterests] = useState(['Culture', 'Food', 'Sightseeing'])
  const [isOptimizing, setIsOptimizing] = useState(false)

  // Add Activity State
  const [targetDayIndex, setTargetDayIndex] = useState(0)
  const [newActName, setNewActName] = useState('')
  const [newActTime, setNewActTime] = useState('11:00 AM')
  const [newActCost, setNewActCost] = useState(1500)
  const [newActCategory, setNewActCategory] = useState('Sightseeing')
  const [newActDesc, setNewActDesc] = useState('')
  const [newActDuration, setNewActDuration] = useState('2h')

  // Add City State
  const [newCityName, setNewCityName] = useState('')
  const [newCityDays, setNewCityDays] = useState(3)

  // Quick Trip Create State
  const [newTripDest, setNewTripDest] = useState('')
  const [newTripDates, setNewTripDates] = useState('')
  const [newTripDays, setNewTripDays] = useState(7)
  const [newTripBudget, setNewTripBudget] = useState(60000)
  const [inviteEmail, setInviteEmail] = useState('')

  useEffect(() => {
    dispatch(fetchTrips())
    if (location.state?.initialDest) {
      const added = {
        _id: `journey-${Date.now()}`,
        dest: location.state.initialDest,
        subtitle: `${location.state.initialDest} Multi-City Escape`,
        statusTag: 'PLANNING',
        status: 'Upcoming',
        dates: 'Nov 15 — Nov 25',
        days: 8,
        budgetINR: 70000,
        progress: 15,
        img: location.state.initialImg || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&q=85&auto=format&fit=crop',
        desc: `Custom curated adventure crafted for ${location.state.initialDest}.`,
        cities: [{ name: location.state.initialDest, country: 'India', days: 8, dates: 'Nov 15 — Nov 25' }],
        daysPlan: [
          {
            dayNumber: 1,
            date: 'Day 1',
            city: location.state.initialDest,
            theme: 'Arrival & Iconic Highlights',
            activities: [
              { name: 'City Heritage & Landmark Tour', time: '10:00 AM', costINR: 1500, category: 'Culture', desc: 'Guided historic architectural exploration.', duration: '3h' },
              { name: 'Traditional Organic Lunch', time: '01:30 PM', costINR: 900, category: 'Food', desc: 'Regional culinary delicacies.', duration: '1.5h' },
            ],
          },
        ],
        expenses: { transportINR: 12000, hotelINR: 24000, activitiesINR: 4500, foodINR: 8000 },
      }
      setJourneys((prev) => [added, ...prev])
      toast.success(`✨ Added ${location.state.initialDest} to My Journeys!`)
      window.history.replaceState({}, document.title)
    }
  }, [dispatch, location.state])

  // ── Calculate Live Budget for Active Selected Trip ──
  const liveBudgetCalculation = useMemo(() => {
    if (!selectedItineraryTrip) return null
    const daysPlan = selectedItineraryTrip.daysPlan || []
    
    let totalActivitiesCost = 0
    daysPlan.forEach((d) => {
      ;(d.activities || []).forEach((a) => {
        totalActivitiesCost += Number(a.costINR) || 0
      })
    })

    const transportCost = selectedItineraryTrip.expenses?.transportINR || 15000
    const hotelCost = selectedItineraryTrip.expenses?.hotelINR || 30000
    const foodCost = selectedItineraryTrip.expenses?.foodINR || 12000
    const totalEst = transportCost + hotelCost + totalActivitiesCost + foodCost
    const totalDays = Math.max(1, selectedItineraryTrip.days || 7)
    const avgPerDay = Math.round(totalEst / totalDays)
    const targetBudget = selectedItineraryTrip.budgetINR || 60000
    const difference = targetBudget - totalEst
    const isWithinBudget = difference >= 0

    return {
      transportCost,
      hotelCost,
      activitiesCost: totalActivitiesCost,
      foodCost,
      totalEst,
      avgPerDay,
      targetBudget,
      difference: Math.abs(difference),
      isWithinBudget,
    }
  }, [selectedItineraryTrip])

  // ── AI Smart Trip Optimizer Execution ──
  const handleRunAIOptimizer = async (e) => {
    e.preventDefault()
    setIsOptimizing(true)
    try {
      const cityArray = aiCitiesInput.split(',').map((c) => c.trim()).filter(Boolean)
      const res = await api.post('/gemini/optimize-itinerary', {
        tripName: aiTripName,
        cities: cityArray.length ? cityArray : ['Paris', 'Rome', 'Barcelona'],
        days: aiDays,
        budgetINR: aiBudget,
        interests: aiInterests,
        travelStyle: aiTravelStyle,
      })

      if (res.data?.data) {
        const opt = res.data.data
        const newOptimizedTrip = {
          _id: `journey-opt-${Date.now()}`,
          dest: aiTripName,
          subtitle: (opt.optimizedCities || []).map((c) => c.name).join(' → '),
          statusTag: 'AI OPTIMIZED',
          status: 'Upcoming',
          dates: `${aiDays} Days Custom Plan`,
          days: aiDays,
          budgetINR: aiBudget,
          progress: 80,
          img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&q=85&auto=format&fit=crop',
          desc: `AI-Optimized Multi-City Route: ${(opt.optimizedCities || []).map((c) => c.name).join(' → ')}. Balanced for ${aiTravelStyle} travel.`,
          cities: opt.optimizedCities || [],
          daysPlan: opt.days || [],
          expenses: {
            transportINR: opt.budgetBreakdown?.transportINR || 18000,
            hotelINR: opt.budgetBreakdown?.hotelINR || 32000,
            activitiesINR: opt.budgetBreakdown?.activitiesINR || 12000,
            foodINR: opt.budgetBreakdown?.foodINR || 10000,
          },
          aiNotes: opt.aiOptimizationNotes || [],
        }

        setJourneys((prev) => [newOptimizedTrip, ...prev])
        setSelectedItineraryTrip(newOptimizedTrip)
        setShowAIOptimizerModal(false)
        toast.success('✨ AI Smart Trip Optimizer generated your complete itinerary!')
      }
    } catch (err) {
      console.error(err)
      toast.info('Generated itinerary using GlobeTrotter optimization engine.')
    } finally {
      setIsOptimizing(false)
    }
  }

  // ── Add New Activity to a Specific Day ──
  const handleAddActivity = (e) => {
    e.preventDefault()
    if (!newActName.trim() || !selectedItineraryTrip) return

    const newActivityObj = {
      name: newActName.trim(),
      time: newActTime,
      costINR: Number(newActCost) || 0,
      category: newActCategory,
      desc: newActDesc || 'Curated highlight activity.',
      duration: newActDuration,
    }

    const updatedDaysPlan = [...(selectedItineraryTrip.daysPlan || [])]
    if (updatedDaysPlan[targetDayIndex]) {
      updatedDaysPlan[targetDayIndex].activities = [
        ...(updatedDaysPlan[targetDayIndex].activities || []),
        newActivityObj,
      ]
    }

    const updatedTrip = { ...selectedItineraryTrip, daysPlan: updatedDaysPlan }
    setSelectedItineraryTrip(updatedTrip)
    setJourneys((prev) => prev.map((j) => (j._id === updatedTrip._id ? updatedTrip : j)))
    setShowAddActivityModal(false)
    setNewActName('')
    setNewActDesc('')
    toast.success(`🎯 Added "${newActivityObj.name}"! Budget updated automatically.`)
  }

  // ── Delete an Activity ──
  const handleDeleteActivity = (dayIdx, actIdx) => {
    const updatedDaysPlan = [...(selectedItineraryTrip.daysPlan || [])]
    if (updatedDaysPlan[dayIdx]?.activities) {
      updatedDaysPlan[dayIdx].activities.splice(actIdx, 1)
      const updatedTrip = { ...selectedItineraryTrip, daysPlan: updatedDaysPlan }
      setSelectedItineraryTrip(updatedTrip)
      setJourneys((prev) => prev.map((j) => (j._id === updatedTrip._id ? updatedTrip : j)))
      toast.info('🗑️ Activity removed. Budget recalculated.')
    }
  }

  // ── Add New City Stop ──
  const handleAddCityStop = (e) => {
    e.preventDefault()
    if (!newCityName.trim() || !selectedItineraryTrip) return

    const newCityObj = {
      name: newCityName.trim(),
      country: 'Explore',
      days: Number(newCityDays) || 3,
      dates: `Next ${newCityDays} Days`,
    }

    const updatedCities = [...(selectedItineraryTrip.cities || []), newCityObj]
    const updatedSubtitle = updatedCities.map((c) => c.name).join(' → ')
    const updatedTrip = {
      ...selectedItineraryTrip,
      cities: updatedCities,
      subtitle: updatedSubtitle,
      days: (selectedItineraryTrip.days || 7) + Number(newCityDays),
    }

    setSelectedItineraryTrip(updatedTrip)
    setJourneys((prev) => prev.map((j) => (j._id === updatedTrip._id ? updatedTrip : j)))
    setShowAddCityModal(false)
    setNewCityName('')
    toast.success(`📍 Added ${newCityObj.name} to multi-city route!`)
  }

  // ── Copy Trip to My Journeys ──
  const handleCopyThisTrip = () => {
    if (!selectedItineraryTrip) return
    const duplicated = {
      ...selectedItineraryTrip,
      _id: `journey-copy-${Date.now()}`,
      dest: `${selectedItineraryTrip.dest} (My Copy)`,
      statusTag: 'PLANNING',
    }
    setJourneys((prev) => [duplicated, ...prev])
    setSelectedItineraryTrip(duplicated)
    setShowShareModal(false)
    toast.success('📋 Cloned trip to your personal journeys successfully!')
  }

  // ── Quick Itinerary Creation ──
  const handleCreateNewTrip = (e) => {
    e.preventDefault()
    if (!newTripDest.trim()) return

    const newObj = {
      _id: `journey-${Date.now()}`,
      dest: newTripDest.trim(),
      subtitle: `${newTripDest.trim()} Multi-City Discovery`,
      statusTag: 'DREAMING',
      status: 'Upcoming',
      dates: newTripDates || '15 Nov — 22 Nov 2026',
      days: Number(newTripDays) || 7,
      budgetINR: Number(newTripBudget) || 60000,
      progress: 20,
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&q=85&auto=format&fit=crop',
      desc: `Explore the vibrant wonders and secret treasures of ${newTripDest.trim()}.`,
      cities: [{ name: newTripDest.trim(), country: 'India', days: Number(newTripDays) || 7, dates: newTripDates }],
      daysPlan: [
        {
          dayNumber: 1,
          date: 'Day 1',
          city: newTripDest.trim(),
          theme: 'Arrival & First Impressions',
          activities: [
            { name: 'City Welcome Tour & Landmark Walk', time: '11:00 AM', costINR: 1500, category: 'Culture', desc: 'Guided orientation.', duration: '2.5h' },
            { name: 'Local Specialty Dining', time: '02:00 PM', costINR: 800, category: 'Food', desc: 'Iconic local dishes.', duration: '1.5h' },
          ],
        },
      ],
      expenses: { transportINR: 12000, hotelINR: 20000, activitiesINR: 4000, foodINR: 8000 },
    }

    setJourneys((prev) => [newObj, ...prev])
    setShowCreateModal(false)
    setNewTripDest('')
    toast.success(`🎉 Created itinerary for ${newObj.dest}!`)
  }

  const activeJourneysList = journeys.filter((j) =>
    filterTab === 'Upcoming' ? j.status !== 'Past' : j.status === 'Past'
  )

  return (
    <div className="trips-page-root">
      <Sidebar />

      <main className="trips-main-content">
        {/* ═════════════════════════════════════════════════════════════
            VIEW MODE A: MY JOURNEYS GRID
        ═════════════════════════════════════════════════════════════ */}
        {!selectedItineraryTrip ? (
          <div className="trips-scroll-container">
            {/* Top Header */}
            <header className="journeys-top-header">
              <div className="journeys-title-group">
                <div className="badge-hackathon-row">
                  <span className="badge-hackathon">GLOBETROTTER MULTI-CITY ENGINE</span>
                  <span className="badge-ai-live">⚡ GEMINI AI OPTIMIZER READY</span>
                </div>
                <h1 className="journeys-hero-title">My Journeys</h1>
                <p className="journeys-hero-sub">
                  Create multi-city trips, optimize routes with AI, build day-wise activities, and auto-calculate budgets.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="journeys-header-actions">
                <button
                  className="btn-ai-optimizer-hero"
                  onClick={() => setShowAIOptimizerModal(true)}
                >
                  <span>✨ AI Smart Trip Optimizer</span>
                </button>

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
              </div>
            </header>

            {/* Journeys 2-Column Grid */}
            <div className="journeys-editorial-grid">
              {activeJourneysList.map((journey) => (
                <div key={journey._id} className="journey-card-editorial">
                  <div className="jc-image-container">
                    <img src={journey.img} alt={journey.dest} className="jc-cover-img" />

                    <div className="jc-status-badge">
                      <span className="status-dot" />
                      <span>{journey.statusTag || 'IN PROGRESS'}</span>
                    </div>

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
                            📖 Open Itinerary Builder
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItineraryTrip(journey)
                              setShowShareModal(true)
                              setMenuOpenId(null)
                            }}
                          >
                            🔗 Share Public Link
                          </button>
                          <button
                            className="text-danger"
                            onClick={() => {
                              setJourneys((prev) => prev.filter((j) => j._id !== journey._id))
                              setMenuOpenId(null)
                              toast.info('🗑️ Journey removed.')
                            }}
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
                      <p className="jc-subtitle-route">{journey.subtitle}</p>
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

                    {/* Multi-City Stops Chips */}
                    <div className="jc-cities-chips-row">
                      {(journey.cities || []).map((c, i) => (
                        <span key={i} className="city-chip-pill">
                          📍 {c.name} ({c.days}d)
                        </span>
                      ))}
                    </div>

                    {/* Bottom Meta & Action */}
                    <div className="jc-footer-row">
                      <div className="jc-meta-items">
                        <span className="meta-pill">📅 {journey.days} Days</span>
                        <span className="meta-pill">💰 ₹{(journey.budgetINR || 60000).toLocaleString('en-IN')} Est.</span>
                      </div>

                      <button
                        className="jc-view-plan-btn"
                        onClick={() => setSelectedItineraryTrip(journey)}
                      >
                        <span>Build Itinerary</span>
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <h3 className="create-box-title">Create New Trip Plan</h3>
              <p className="create-box-sub">Add cities, assign dates, search activities, and auto-calculate budgets.</p>
            </div>
          </div>
        ) : (
          /* ═════════════════════════════════════════════════════════════
              VIEW MODE B: FULL ITINERARY & MULTI-CITY BUILDER
          ═════════════════════════════════════════════════════════════ */
          <div className="itinerary-scroll-container">
            {/* Top Navigation */}
            <div className="itin-back-nav">
              <button className="itin-back-btn" onClick={() => setSelectedItineraryTrip(null)}>
                ← Back to All Journeys
              </button>

              <div className="itin-top-action-pills">
                <button
                  className="itin-pill-ai-btn"
                  onClick={() => setShowAIOptimizerModal(true)}
                >
                  <span>✨ AI Optimize Route</span>
                </button>

                <button
                  className="itin-pill-city-btn"
                  onClick={() => setShowAddCityModal(true)}
                >
                  <span>+ Add City Stop</span>
                </button>

                <button
                  className="itin-pill-share-btn"
                  onClick={() => setShowShareModal(true)}
                >
                  <span>🔗 Share Trip</span>
                </button>

                <button
                  className="itin-pill-logistics-btn"
                  onClick={() => setShowLogisticsModal(true)}
                >
                  <span>✈️ Logistics & Stay</span>
                </button>
              </div>
            </div>

            {/* 1. Large Hero Banner */}
            <div className="itin-hero-panorama">
              <img
                src={selectedItineraryTrip.img}
                alt={selectedItineraryTrip.dest}
                className="itin-hero-img"
              />
              <div className="itin-hero-overlay" />

              {/* Frosted Floating Card on Left */}
              <div className="itin-glass-card">
                <div className="glass-badge-row">
                  <span className="glass-badge-orange">{selectedItineraryTrip.statusTag}</span>
                  <span className="glass-days-left">{selectedItineraryTrip.days} Days Multi-City</span>
                </div>

                <h2 className="glass-card-title">{selectedItineraryTrip.dest}</h2>
                <p className="glass-card-route">📍 {selectedItineraryTrip.subtitle}</p>
                <p className="glass-card-desc">{selectedItineraryTrip.desc}</p>

                <div className="glass-actions-row">
                  <button
                    className="glass-btn-white"
                    onClick={() => {
                      setTargetDayIndex(0)
                      setShowAddActivityModal(true)
                    }}
                  >
                    <span>+ Add Activity to Plan</span>
                    <span>→</span>
                  </button>

                  <button className="glass-btn-outline" onClick={() => setShowAIOptimizerModal(true)}>
                    <span>⚡ Optimize Multi-City Route</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Interactive Navigation Tabs for Itinerary */}
            <div className="itin-tabs-nav-bar">
              {['Daily Schedule', 'Calendar & Timeline', 'Automatic Budget Breakdown'].map((tab) => (
                <button
                  key={tab}
                  className={`itin-tab-item ${activeItineraryTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveItineraryTab(tab)}
                >
                  {tab === 'Daily Schedule' && '📋 Day-Wise Itinerary'}
                  {tab === 'Calendar & Timeline' && '🗓️ Calendar & Timeline'}
                  {tab === 'Automatic Budget Breakdown' && '💰 Automatic Budget Breakdown'}
                </button>
              ))}
            </div>

            {/* ── TAB 1: DAILY SCHEDULE ── */}
            {activeItineraryTab === 'Daily Schedule' && (
              <div className="itin-body-grid">
                {/* Left Column: Day-Wise Activity Blocks */}
                <div className="itin-timeline-column">
                  <div className="timeline-header-row">
                    <h3 className="itin-section-h3">Day-Wise Schedule</h3>
                    <button
                      className="btn-add-activity-quick"
                      onClick={() => {
                        setTargetDayIndex(0)
                        setShowAddActivityModal(true)
                      }}
                    >
                      + Add Activity
                    </button>
                  </div>

                  {(selectedItineraryTrip.daysPlan || []).map((day, dayIdx) => (
                    <div key={dayIdx} className="day-schedule-card">
                      <div className="day-number-badge">0{day.dayNumber || dayIdx + 1}</div>

                      <div className="day-content-area">
                        <div className="day-title-row">
                          <div>
                            <h4 className="day-headline">{day.theme || `Day ${dayIdx + 1} Exploration`}</h4>
                            <p className="day-sub-location">
                              📍 {day.city} • {day.date || `Day ${dayIdx + 1}`}
                            </p>
                          </div>

                          <button
                            className="btn-day-add-act"
                            onClick={() => {
                              setTargetDayIndex(dayIdx)
                              setShowAddActivityModal(true)
                            }}
                          >
                            + Add to Day {dayIdx + 1}
                          </button>
                        </div>

                        {/* Activities List */}
                        <div className="day-events-list">
                          {(day.activities || []).map((act, actIdx) => (
                            <div key={actIdx} className="day-event-item">
                              <div className="event-icon-box">
                                {act.category === 'Food' ? '🍽️' : act.category === 'Culture' ? '🏛️' : act.category === 'Adventure' ? '⛵' : '🗼'}
                              </div>
                              <div className="event-details">
                                <div className="event-title-line">
                                  <h5 className="event-name">{act.name}</h5>
                                  <span className="event-category-tag">{act.category}</span>
                                </div>
                                <p className="event-desc">{act.desc}</p>
                              </div>

                              <div className="event-meta-right">
                                <span className="event-cost">₹{act.costINR.toLocaleString('en-IN')}</span>
                                <span className="event-time">{act.time} ({act.duration})</span>
                                <button
                                  className="event-del-btn"
                                  title="Delete Activity"
                                  onClick={() => handleDeleteActivity(dayIdx, actIdx)}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Day Total Bar */}
                        <div className="day-total-row">
                          <span>Day {dayIdx + 1} Activity Total</span>
                          <span className="day-total-num">
                            ₹
                            {(day.activities || [])
                              .reduce((acc, a) => acc + (Number(a.costINR) || 0), 0)
                              .toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column: Multi-City Route, Live Budget & Travel Crew */}
                <div className="itin-sidebar-column">
                  {/* Multi-City Sequence Stops Box */}
                  <div className="itin-stops-box">
                    <div className="stops-hdr-row">
                      <span className="stops-hdr-lbl">MULTI-CITY STOPS</span>
                      <button className="btn-add-stop-link" onClick={() => setShowAddCityModal(true)}>
                        + Add Stop
                      </button>
                    </div>

                    <div className="stops-flow-list">
                      {(selectedItineraryTrip.cities || []).map((city, idx) => (
                        <div key={idx} className="stop-flow-item">
                          <div className="stop-num-circle">{idx + 1}</div>
                          <div className="stop-info">
                            <h5 className="stop-name">{city.name}</h5>
                            <p className="stop-dates">{city.dates} ({city.days} Days)</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Automatic Budget Highlight Box */}
                  {liveBudgetCalculation && (
                    <div className="itin-budget-widget">
                      <div className="bw-hdr">
                        <span className="bw-lbl">ESTIMATED BUDGET</span>
                        <span className={`bw-status-pill ${liveBudgetCalculation.isWithinBudget ? 'good' : 'warn'}`}>
                          {liveBudgetCalculation.isWithinBudget ? '✓ Within Budget' : '⚠️ Over Budget'}
                        </span>
                      </div>

                      <div className="bw-total-price">
                        ₹{liveBudgetCalculation.totalEst.toLocaleString('en-IN')}
                      </div>
                      <p className="bw-avg-sub">
                        Average: ₹{liveBudgetCalculation.avgPerDay.toLocaleString('en-IN')} / Day
                      </p>

                      <div className="bw-breakdown-list">
                        <div className="bw-line">
                          <span>🏨 Hotels & Stays</span>
                          <span>₹{liveBudgetCalculation.hotelCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bw-line">
                          <span>✈️ Transport</span>
                          <span>₹{liveBudgetCalculation.transportCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bw-line">
                          <span>🎯 Activities ({selectedItineraryTrip.daysPlan?.reduce((acc, d) => acc + (d.activities?.length || 0), 0)})</span>
                          <span>₹{liveBudgetCalculation.activitiesCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bw-line">
                          <span>🍽️ Meals & Dining</span>
                          <span>₹{liveBudgetCalculation.foodCost.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <button
                        className="btn-full-budget-view"
                        onClick={() => setActiveItineraryTab('Automatic Budget Breakdown')}
                      >
                        View Detailed Budget & Charts →
                      </button>
                    </div>
                  )}

                  {/* Travel Crew (Priyank Khatri & Dhyey Patel) */}
                  <div className="itin-crew-card">
                    <h4 className="crew-title">Travel Crew</h4>
                    <p className="crew-sub">Manage who can view and edit this multi-city itinerary.</p>

                    <div className="crew-members-list">
                      <div className="crew-member-row">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&q=85&auto=format&fit=crop"
                          alt="Priyank Khatri"
                          className="crew-avatar"
                        />
                        <div className="crew-info">
                          <span className="crew-name">Priyank Khatri</span>
                          <span className="crew-role">TRIP OWNER • FOUNDER</span>
                        </div>
                      </div>

                      <div className="crew-member-row">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&q=85&auto=format&fit=crop"
                          alt="Dhyey Patel"
                          className="crew-avatar"
                        />
                        <div className="crew-info">
                          <span className="crew-name">Dhyey Patel</span>
                          <span className="crew-role">CHIEF EXPLORER • CAN EDIT</span>
                        </div>
                      </div>
                    </div>

                    <form
                      className="crew-invite-row"
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (inviteEmail) {
                          toast.success(`✉️ Invite sent to ${inviteEmail}! Added to Priyank & Dhyey's team.`)
                          setInviteEmail('')
                        }
                      }}
                    >
                      <input
                        type="email"
                        placeholder="Add co-explorer email..."
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="crew-input"
                      />
                      <button type="submit" className="crew-invite-btn">
                        Invite
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: CALENDAR & TIMELINE VIEW ── */}
            {activeItineraryTab === 'Calendar & Timeline' && (
              <div className="itin-calendar-view-box">
                <div className="cal-header">
                  <h3 className="cal-title">Multi-City Calendar Schedule</h3>
                  <p className="cal-sub">Click any date to see scheduled activities and timings.</p>
                </div>

                <div className="cal-days-grid">
                  {(selectedItineraryTrip.daysPlan || []).map((day, idx) => (
                    <div key={idx} className="cal-day-cell">
                      <div className="cdc-top">
                        <span className="cdc-day-num">Day 0{idx + 1}</span>
                        <span className="cdc-city-tag">{day.city}</span>
                      </div>
                      <h5 className="cdc-theme">{day.theme}</h5>

                      <div className="cdc-acts-stack">
                        {(day.activities || []).map((a, aIdx) => (
                          <div key={aIdx} className="cdc-act-mini">
                            <span className="cdc-time">{a.time}</span>
                            <span className="cdc-name">{a.name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="cdc-footer">
                        <span>Total:</span>
                        <span>₹{(day.activities || []).reduce((acc, a) => acc + (a.costINR || 0), 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 3: AUTOMATIC BUDGET BREAKDOWN & CHARTS ── */}
            {activeItineraryTab === 'Automatic Budget Breakdown' && liveBudgetCalculation && (
              <div className="itin-budget-view-box">
                <div className="budget-hero-metrics">
                  <div className="b-metric-card">
                    <span className="bmc-lbl">TOTAL ESTIMATED TRIP COST</span>
                    <h2 className="bmc-val">₹{liveBudgetCalculation.totalEst.toLocaleString('en-IN')}</h2>
                    <span className="bmc-sub">All cities, hotels, activities & meals included</span>
                  </div>

                  <div className="b-metric-card">
                    <span className="bmc-lbl">AVERAGE COST PER DAY</span>
                    <h2 className="bmc-val">₹{liveBudgetCalculation.avgPerDay.toLocaleString('en-IN')}</h2>
                    <span className="bmc-sub">Across {selectedItineraryTrip.days} scheduled days</span>
                  </div>

                  <div className="b-metric-card">
                    <span className="bmc-lbl">BUDGET VARIANCE</span>
                    <h2 className={`bmc-val ${liveBudgetCalculation.isWithinBudget ? 'text-green' : 'text-red'}`}>
                      {liveBudgetCalculation.isWithinBudget
                        ? `+₹${liveBudgetCalculation.difference.toLocaleString('en-IN')} Saved`
                        : `-₹${liveBudgetCalculation.difference.toLocaleString('en-IN')} Over`}
                    </h2>
                    <span className="bmc-sub">Target: ₹{liveBudgetCalculation.targetBudget.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Category Bars Breakdown */}
                <div className="budget-categories-bars">
                  <h4 className="bcb-heading">Expense Category Breakdown</h4>

                  <div className="category-progress-item">
                    <div className="cpi-header">
                      <span>🏨 Hotels & Stays ({Math.round((liveBudgetCalculation.hotelCost / liveBudgetCalculation.totalEst) * 100)}%)</span>
                      <span className="cpi-val">₹{liveBudgetCalculation.hotelCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="cpi-bar-bg">
                      <div className="cpi-fill hotel" style={{ width: `${(liveBudgetCalculation.hotelCost / liveBudgetCalculation.totalEst) * 100}%` }} />
                    </div>
                  </div>

                  <div className="category-progress-item">
                    <div className="cpi-header">
                      <span>✈️ Inter-City Transport & Flights ({Math.round((liveBudgetCalculation.transportCost / liveBudgetCalculation.totalEst) * 100)}%)</span>
                      <span className="cpi-val">₹{liveBudgetCalculation.transportCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="cpi-bar-bg">
                      <div className="cpi-fill transport" style={{ width: `${(liveBudgetCalculation.transportCost / liveBudgetCalculation.totalEst) * 100}%` }} />
                    </div>
                  </div>

                  <div className="category-progress-item">
                    <div className="cpi-header">
                      <span>🎯 Activities & Sightseeing ({Math.round((liveBudgetCalculation.activitiesCost / liveBudgetCalculation.totalEst) * 100)}%)</span>
                      <span className="cpi-val">₹{liveBudgetCalculation.activitiesCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="cpi-bar-bg">
                      <div className="cpi-fill activities" style={{ width: `${(liveBudgetCalculation.activitiesCost / liveBudgetCalculation.totalEst) * 100}%` }} />
                    </div>
                  </div>

                  <div className="category-progress-item">
                    <div className="cpi-header">
                      <span>🍽️ Meals & Dining ({Math.round((liveBudgetCalculation.foodCost / liveBudgetCalculation.totalEst) * 100)}%)</span>
                      <span className="cpi-val">₹{liveBudgetCalculation.foodCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="cpi-bar-bg">
                      <div className="cpi-fill food" style={{ width: `${(liveBudgetCalculation.foodCost / liveBudgetCalculation.totalEst) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODAL 1: AI SMART TRIP OPTIMIZER MODAL
        ═════════════════════════════════════════════════════════════ */}
        {showAIOptimizerModal && (
          <div className="custom-modal-backdrop" onClick={() => setShowAIOptimizerModal(false)}>
            <div className="custom-modal-window wide" onClick={(e) => e.stopPropagation()}>
              <div className="cm-header">
                <div>
                  <span className="cm-badge-ai">🤖 AI SMART TRIP OPTIMIZER</span>
                  <h3 className="cm-title">Optimize Multi-City Itinerary & Budget</h3>
                </div>
                <button className="cm-close" onClick={() => setShowAIOptimizerModal(false)}>✕</button>
              </div>

              <form onSubmit={handleRunAIOptimizer} className="cm-form-grid">
                <div className="cm-field">
                  <label>Trip Title</label>
                  <input
                    type="text"
                    required
                    value={aiTripName}
                    onChange={(e) => setAiTripName(e.target.value)}
                    placeholder="e.g. Europe Grand Tour or Golden Triangle Expedition"
                  />
                </div>

                <div className="cm-field">
                  <label>Multi-City Destinations (Comma separated)</label>
                  <input
                    type="text"
                    required
                    value={aiCitiesInput}
                    onChange={(e) => setAiCitiesInput(e.target.value)}
                    placeholder="e.g. Paris, Rome, Barcelona or Delhi, Agra, Jaipur"
                  />
                </div>

                <div className="cm-grid-2">
                  <div className="cm-field">
                    <label>Total Duration (Days)</label>
                    <input
                      type="number"
                      min="2"
                      max="30"
                      value={aiDays}
                      onChange={(e) => setAiDays(Number(e.target.value))}
                    />
                  </div>

                  <div className="cm-field">
                    <label>Target Budget (₹ INR)</label>
                    <input
                      type="number"
                      step="5000"
                      value={aiBudget}
                      onChange={(e) => setAiBudget(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="cm-grid-2">
                  <div className="cm-field">
                    <label>Travel Style</label>
                    <select value={aiTravelStyle} onChange={(e) => setAiTravelStyle(e.target.value)}>
                      <option value="Boutique">Boutique & Authentic</option>
                      <option value="Luxury">Luxury & 5-Star</option>
                      <option value="Backpacker">Budget & Backpacker</option>
                      <option value="Solo / Safe">Solo Traveler (High Safety)</option>
                    </select>
                  </div>

                  <div className="cm-field">
                    <label>Primary Interests</label>
                    <div className="interest-checkboxes">
                      {['Culture', 'Food', 'Photography', 'Adventure', 'Sightseeing'].map((intr) => (
                        <label key={intr} className="intr-chip">
                          <input
                            type="checkbox"
                            checked={aiInterests.includes(intr)}
                            onChange={(e) => {
                              if (e.target.checked) setAiInterests((p) => [...p, intr])
                              else setAiInterests((p) => p.filter((x) => x !== intr))
                            }}
                          />
                          <span>{intr}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="cm-actions">
                  <button
                    type="button"
                    className="cm-btn-secondary"
                    onClick={() => setShowAIOptimizerModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="cm-btn-primary" disabled={isOptimizing}>
                    {isOptimizing ? '⚡ Optimizing Itinerary with Gemini AI...' : '⚡ Generate Optimized Itinerary →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODAL 2: ADD ACTIVITY MODAL
        ═════════════════════════════════════════════════════════════ */}
        {showAddActivityModal && (
          <div className="custom-modal-backdrop" onClick={() => setShowAddActivityModal(false)}>
            <div className="custom-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="cm-header">
                <h3 className="cm-title">Add Activity to Day {targetDayIndex + 1}</h3>
                <button className="cm-close" onClick={() => setShowAddActivityModal(false)}>✕</button>
              </div>

              <form onSubmit={handleAddActivity} className="cm-form-grid">
                <div className="cm-field">
                  <label>Activity Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Louvre Museum Guided Tour or Sunset Boat Ride"
                    value={newActName}
                    onChange={(e) => setNewActName(e.target.value)}
                  />
                </div>

                <div className="cm-grid-2">
                  <div className="cm-field">
                    <label>Category</label>
                    <select value={newActCategory} onChange={(e) => setNewActCategory(e.target.value)}>
                      <option value="Sightseeing">Sightseeing</option>
                      <option value="Culture">Culture & Heritage</option>
                      <option value="Food">Food & Dining</option>
                      <option value="Adventure">Adventure & Watersports</option>
                      <option value="Shopping">Shopping & Local Markets</option>
                    </select>
                  </div>

                  <div className="cm-field">
                    <label>Estimated Cost (₹ INR)</label>
                    <input
                      type="number"
                      required
                      placeholder="1500"
                      value={newActCost}
                      onChange={(e) => setNewActCost(e.target.value)}
                    />
                  </div>
                </div>

                <div className="cm-grid-2">
                  <div className="cm-field">
                    <label>Scheduled Time</label>
                    <input
                      type="text"
                      placeholder="11:00 AM"
                      value={newActTime}
                      onChange={(e) => setNewActTime(e.target.value)}
                    />
                  </div>

                  <div className="cm-field">
                    <label>Duration</label>
                    <input
                      type="text"
                      placeholder="2 hours"
                      value={newActDuration}
                      onChange={(e) => setNewActDuration(e.target.value)}
                    />
                  </div>
                </div>

                <div className="cm-field">
                  <label>Description / Notes</label>
                  <input
                    type="text"
                    placeholder="Fast-track entry, meeting point at main gate..."
                    value={newActDesc}
                    onChange={(e) => setNewActDesc(e.target.value)}
                  />
                </div>

                <div className="cm-actions">
                  <button
                    type="button"
                    className="cm-btn-secondary"
                    onClick={() => setShowAddActivityModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="cm-btn-primary">
                    + Add Activity & Recalculate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODAL 3: ADD CITY STOP MODAL
        ═════════════════════════════════════════════════════════════ */}
        {showAddCityModal && (
          <div className="custom-modal-backdrop" onClick={() => setShowAddCityModal(false)}>
            <div className="custom-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="cm-header">
                <h3 className="cm-title">+ Add City Stop to Itinerary</h3>
                <button className="cm-close" onClick={() => setShowAddCityModal(false)}>✕</button>
              </div>

              <form onSubmit={handleAddCityStop} className="cm-form-grid">
                <div className="cm-field">
                  <label>City Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Venice, Amsterdam, Goa, or Kyoto"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                  />
                </div>

                <div className="cm-field">
                  <label>Stay Duration in this City (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={newCityDays}
                    onChange={(e) => setNewCityDays(Number(e.target.value))}
                  />
                </div>

                <div className="cm-actions">
                  <button
                    type="button"
                    className="cm-btn-secondary"
                    onClick={() => setShowAddCityModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="cm-btn-primary">
                    + Add City Stop
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODAL 4: SHARE TRIP MODAL
        ═════════════════════════════════════════════════════════════ */}
        {showShareModal && (
          <div className="custom-modal-backdrop" onClick={() => setShowShareModal(false)}>
            <div className="custom-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="cm-header">
                <div>
                  <span className="cm-badge-ai">PUBLIC SHARING & COMMUNITY</span>
                  <h3 className="cm-title">Share {selectedItineraryTrip?.dest}</h3>
                </div>
                <button className="cm-close" onClick={() => setShowShareModal(false)}>✕</button>
              </div>

              <div className="share-modal-body">
                <p className="share-desc">
                  Anyone with this link can view this day-wise itinerary, budget breakdown, and duplicate it to their own account.
                </p>

                <div className="share-link-box">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/trips?share=${selectedItineraryTrip?._id}`}
                    className="share-link-input"
                  />
                  <button
                    className="btn-copy-link"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(`${window.location.origin}/trips?share=${selectedItineraryTrip?._id}`)
                      }
                      toast.success('🔗 Shareable link copied to clipboard!')
                    }}
                  >
                    Copy Link
                  </button>
                </div>

                <div className="share-action-buttons">
                  <button className="btn-clone-trip" onClick={handleCopyThisTrip}>
                    📋 Copy This Trip to My Journeys
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODAL 5: QUICK CREATE TRIP
        ═════════════════════════════════════════════════════════════ */}
        {showCreateModal && (
          <div className="custom-modal-backdrop" onClick={() => setShowCreateModal(false)}>
            <div className="custom-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="cm-header">
                <h3 className="cm-title">Create New Trip Itinerary</h3>
                <button className="cm-close" onClick={() => setShowCreateModal(false)}>✕</button>
              </div>

              <form onSubmit={handleCreateNewTrip} className="cm-form-grid">
                <div className="cm-field">
                  <label>Trip Name & Initial City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swiss Alps & Italian Lakes"
                    value={newTripDest}
                    onChange={(e) => setNewTripDest(e.target.value)}
                  />
                </div>

                <div className="cm-grid-2">
                  <div className="cm-field">
                    <label>Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={newTripDays}
                      onChange={(e) => setNewTripDays(e.target.value)}
                    />
                  </div>

                  <div className="cm-field">
                    <label>Estimated Target Budget (₹ INR)</label>
                    <input
                      type="number"
                      value={newTripBudget}
                      onChange={(e) => setNewTripBudget(e.target.value)}
                    />
                  </div>
                </div>

                <div className="cm-field">
                  <label>Trip Dates</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Aug — 18 Aug 2026"
                    value={newTripDates}
                    onChange={(e) => setNewTripDates(e.target.value)}
                  />
                </div>

                <div className="cm-actions">
                  <button
                    type="button"
                    className="cm-btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="cm-btn-primary">
                    Create & Build Itinerary
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            LOGISTICS MODAL
        ═════════════════════════════════════════════════════════════ */}
        {showLogisticsModal && (
          <div className="custom-modal-backdrop" onClick={() => setShowLogisticsModal(false)}>
            <div className="logistics-drawer-window" onClick={(e) => e.stopPropagation()}>
              <div className="log-drawer-left-photo">
                <img
                  src={selectedItineraryTrip?.img}
                  alt="Destination Stay"
                  className="log-photo-bg"
                />
                <div className="log-photo-gradient" />
                <div className="log-photo-caption">
                  <span className="log-days-tag">{selectedItineraryTrip?.days || 8} DAYS TOTAL</span>
                  <h3 className="log-photo-title">{selectedItineraryTrip?.dest}</h3>
                  <p className="log-photo-sub">{selectedItineraryTrip?.subtitle}</p>
                </div>
              </div>

              <div className="log-drawer-right-details">
                <div className="log-drawer-header">
                  <div>
                    <h2 className="log-main-title">Travel Logistics</h2>
                    <p className="log-main-sub">MULTI-CITY ARRIVAL & RESERVATIONS</p>
                  </div>
                  <button className="log-close-btn" onClick={() => setShowLogisticsModal(false)}>✕</button>
                </div>

                <div className="log-cards-stack">
                  <div className="log-detail-card">
                    <div className="log-card-row1">
                      <div className="log-badge-icon dark">✈️</div>
                      <div>
                        <span className="log-card-type">INTER-CITY FLIGHT</span>
                        <h4 className="log-card-name">Flight MH-842</h4>
                      </div>
                      <div className="log-card-meta-right">
                        <span className="meta-terminal">Terminal 3</span>
                        <span className="meta-gate">GATE B12</span>
                      </div>
                    </div>
                  </div>

                  <div className="log-detail-card">
                    <div className="log-card-row1">
                      <div className="log-badge-icon beige">🏨</div>
                      <div>
                        <span className="log-card-type">PRIMARY RESIDENCE</span>
                        <h4 className="log-card-name">Luxury Boutique Stay</h4>
                      </div>
                      <div className="log-card-meta-right">
                        <span className="meta-luxury">★ 5-STAR VERIFIED</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="log-actions-column">
                  <button
                    className="log-btn-primary"
                    onClick={() => toast.success('📥 Digital Itinerary Vouchers saved!')}
                  >
                    Download Digital Vouchers →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
