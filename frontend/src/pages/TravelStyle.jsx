import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import { useToast } from '../context/ToastContext'
import { usePageTitle } from '../hooks/usePageTitle'
import './TravelStyle.css'

const QUESTIONS = [
  {
    id: 1,
    title: 'Primary Travel Landscape',
    subtitle: 'Which terrain and natural atmosphere resonates most with your spirit?',
    dimension: 'landscape',
    options: [
      {
        val: 'mountain',
        label: 'Alpine Mountains & High Passes',
        desc: 'Towering peaks, serene monasteries, high-altitude passes, and pristine starscapes.',
        icon: 'mountain',
      },
      {
        val: 'coastal',
        label: 'Azure Coastlines & Secluded Islands',
        desc: 'Turquoise waters, pristine private beaches, sunset boat sails, and coastal breeze.',
        icon: 'coastal',
      },
      {
        val: 'heritage',
        label: 'Royal Palaces & Living Heritage',
        desc: 'Ancient forts, opulent architecture, royal dining, and centuries-old traditions.',
        icon: 'heritage',
      },
      {
        val: 'wellness',
        label: 'Holistic Ayurveda & Tropical Havens',
        desc: 'Serene backwaters, yoga retreats, spice plantations, and rejuvenating therapies.',
        icon: 'wellness',
      },
    ],
  },
  {
    id: 2,
    title: 'Preferred Travel Pace & Cadence',
    subtitle: 'How do you prefer your daily itinerary to unfold?',
    dimension: 'pace',
    options: [
      {
        val: 'slow',
        label: 'Slow & Immersive',
        desc: 'Relaxed mornings, 1-2 curated highlights per day, deep neighborhood walks and lingering coffees.',
        icon: 'slow',
      },
      {
        val: 'active',
        label: 'Active Adventure & Expeditions',
        desc: 'Sunrise treks, multi-activity day routes, rafting, viewpoint summits, and high energy.',
        icon: 'active',
      },
      {
        val: 'luxury',
        label: 'Bespoke Luxury & Pampering',
        desc: 'Private chauffeur, 5-star sanctuary check-in, tasting menus, and zero logistics hassle.',
        icon: 'luxury',
      },
    ],
  },
  {
    id: 3,
    title: 'Target Investment Style',
    subtitle: 'Select your preferred accommodation and expedition tier.',
    dimension: 'budget',
    options: [
      {
        val: 'smart',
        label: 'Smart Explorer (₹25,000 — ₹45,000)',
        desc: 'Authentic boutique stays, verified homestays, and local culinary treasures.',
        icon: 'smart',
      },
      {
        val: 'boutique',
        label: 'Boutique Luxury (₹45,000 — ₹85,000)',
        desc: 'Heritage havelis, 4-star pool suites, private guided tours, and artisanal dining.',
        icon: 'boutique',
      },
      {
        val: 'estate',
        label: 'Royal & Ultra-Luxury (₹85,000+)',
        desc: 'Palace reserves, private yachts, exclusive helicopter transfers, and dedicated concierge.',
        icon: 'estate',
      },
    ],
  },
  {
    id: 4,
    title: 'Companionship & Safety Profile',
    subtitle: 'Who is joining your upcoming expedition?',
    dimension: 'companion',
    options: [
      {
        val: 'solo',
        label: 'Solo Explorer (Verified Safety & Women Guides)',
        desc: 'Curated for independence with 24/7 SOS safety, verified women hosts, and community hubs.',
        icon: 'solo',
      },
      {
        val: 'couple',
        label: 'Couple & Romantic Sanctuary',
        desc: 'Private candlelit sunset sails, secluded villas, and romantic scenic vistas.',
        icon: 'couple',
      },
      {
        val: 'squad',
        label: 'Travel Squad & Friends',
        desc: 'Shared multi-bedroom estates, group adventure trails, and vibrant dining tables.',
        icon: 'squad',
      },
    ],
  },
]

const ARCHETYPES = {
  mountain: {
    title: 'The High-Altitude Alpine Nomad',
    badge: 'MOUNTAIN & ADVENTURE ARCHETYPE',
    tagline: 'You thrive where high summits touch the clouds and trails test your resilience.',
    description:
      'Your travel DNA seeks raw wilderness, high Himalayan passes, ancient monastery chants, and off-grid mountain cabins. You value breathtaking panoramic vistas, fresh alpine air, and celestial stargazing far from crowded cities.',
    traits: [
      { name: 'High-Altitude Passion', pct: 98 },
      { name: 'Adrenaline & Trekking', pct: 94 },
      { name: 'Serenity & Stargazing', pct: 96 },
    ],
    matches: [
      {
        id: 'ladakh-expedition',
        name: 'Ladakh High-Pass & Pangong Oasis',
        region: 'Leh-Ladakh, Himalayas',
        country: 'India',
        matchPct: 99,
        priceINR: '₹45,000',
        duration: '8 Days / 7 Nights',
        safetyScore: '9.8 / 10 Solo Safe',
        bestSeason: 'May to October',
        highlights: ['Khardung La Pass', 'Pangong Tso Lakeside Stay', 'Thiksey Sunrise Chants'],
        img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&q=85&auto=format&fit=crop',
      },
      {
        id: 'spiti-valley',
        name: 'Spiti Valley Celestial Stargazing Trail',
        region: 'Himachal Pradesh',
        country: 'India',
        matchPct: 96,
        priceINR: '₹36,000',
        duration: '7 Days / 6 Nights',
        safetyScore: '9.7 / 10 Solo Safe',
        bestSeason: 'June to October',
        highlights: ['Key Gompa Monastery', 'Chandratal Moon Lake Camp', 'Hikkim Highest Post Office'],
        img: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&h=600&q=85&auto=format&fit=crop',
      },
      {
        id: 'swiss-alps',
        name: 'Swiss Alps Expedition',
        region: 'Bernese Oberland',
        country: 'Switzerland',
        matchPct: 92,
        priceINR: '₹3,57,000',
        duration: '7 Days / 6 Nights',
        safetyScore: '9.9 / 10 Solo Safe',
        bestSeason: 'June to September',
        highlights: ['Matterhorn Vista Trek', 'Glacier Express Scenic Pass', 'Private Alpine Chalet'],
        img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&q=85&auto=format&fit=crop',
      },
    ],
  },
  coastal: {
    title: 'The Coastal Sanctuary Seeker',
    badge: 'BEACH & ISLAND ARCHETYPE',
    tagline: 'You are recharged by turquoise ocean horizons, cliffside breezes, and sunset boat sails.',
    description:
      'Your travel DNA is attuned to coastal rhythm, organic seafood dining by the water, sailing secluded bays, and falling asleep to the gentle crash of waves. You gravitate toward barefoot luxury and unhurried coastal retreats.',
    traits: [
      { name: 'Coastal Tranquility', pct: 99 },
      { name: 'Ocean Watersports & Sails', pct: 92 },
      { name: 'Sunset Relaxation', pct: 97 },
    ],
    matches: [
      {
        id: 'andaman-coral',
        name: 'Andaman Turquoise Reefs & Havelock',
        region: 'Andaman & Nicobar Islands',
        country: 'India',
        matchPct: 98,
        priceINR: '₹65,000',
        duration: '6 Days / 5 Nights',
        safetyScore: '9.8 / 10 Solo Safe',
        bestSeason: 'November to May',
        highlights: ['Bioluminescence Night Kayak', 'PADI Scuba Diving', 'Radhanagar Sunset Beach'],
        img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&h=600&q=85&auto=format&fit=crop',
      },
      {
        id: 'gokarna-boho',
        name: 'Gokarna Bohemian Coastal Haven',
        region: 'Karnataka Coastal Trail',
        country: 'India',
        matchPct: 95,
        priceINR: '₹22,000',
        duration: '4 Days / 3 Nights',
        safetyScore: '9.8 / 10 Solo Safe',
        bestSeason: 'October to April',
        highlights: ['5-Beach Coastal Cliff Hike', 'Dolphin Spotting Boat Ride', 'Beachfront Sunset Cafes'],
        img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&q=85&auto=format&fit=crop',
      },
      {
        id: 'amalfi-coast',
        name: 'Amalfi Coast & Capri Odyssey',
        region: 'Campania',
        country: 'Italy',
        matchPct: 93,
        priceINR: '₹3,06,000',
        duration: '6 Days / 5 Nights',
        safetyScore: '9.7 / 10 Solo Safe',
        bestSeason: 'May to September',
        highlights: ['Private Capri Yacht Charter', 'Positano Sunset Terraces', 'Limoncello Workshop'],
        img: 'https://images.unsplash.com/photo-1533104182429-4b31e8ae3e9e?w=800&h=600&q=85&auto=format&fit=crop',
      },
    ],
  },
  heritage: {
    title: 'The Royal Heritage Connoisseur',
    badge: 'HERITAGE & CULTURE ARCHETYPE',
    tagline: 'You travel to immerse in living history, regal palaces, and timeless architecture.',
    description:
      'Your travel DNA celebrates rich cultural legacies, private palace courtyards, artisan handcrafts, and authentic regional gastronomic traditions. You appreciate stories etched into sandstone walls and royal hospitality.',
    traits: [
      { name: 'Architectural Wonder', pct: 99 },
      { name: 'Heritage Gastronomy', pct: 95 },
      { name: 'Artisan Storytelling', pct: 94 },
    ],
    matches: [
      {
        id: 'udaipur-heritage',
        name: 'Udaipur Royal Palaces & Mewar Royalty',
        region: 'Udaipur, Rajasthan',
        country: 'India',
        matchPct: 99,
        priceINR: '₹42,000',
        duration: '5 Days / 4 Nights',
        safetyScore: '9.7 / 10 Solo Safe',
        bestSeason: 'September to March',
        highlights: ['City Palace Private Courtyard', 'Lake Pichola Sunset Yacht', 'Bagore Ki Haveli Folk Show'],
        img: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&h=600&q=85&auto=format&fit=crop',
      },
      {
        id: 'kyoto-heritage',
        name: 'Kyoto Heritage Trail & Zen Temples',
        region: 'Kansai Region',
        country: 'Japan',
        matchPct: 96,
        priceINR: '₹2,63,500',
        duration: '6 Days / 5 Nights',
        safetyScore: '9.9 / 10 Solo Safe',
        bestSeason: 'March - May & Oct - Nov',
        highlights: ['Fushimi Inari Sunrise Walk', 'Traditional Uji Tea Ceremony', 'Arashiyama Bamboo Grove'],
        img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&q=85&auto=format&fit=crop',
      },
      {
        id: 'jaipur-rajasthan',
        name: 'Jaipur Fortresses & Pink City Palaces',
        region: 'Rajasthan',
        country: 'India',
        matchPct: 94,
        priceINR: '₹34,000',
        duration: '4 Days / 3 Nights',
        safetyScore: '9.6 / 10 Solo Safe',
        bestSeason: 'October to March',
        highlights: ['Amber Fort Elephant Trails', 'Hawa Mahal Honeycomb Walk', 'Royal Textile Guilds'],
        img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=600&q=85&auto=format&fit=crop',
      },
    ],
  },
  wellness: {
    title: 'The Holistic Ayurveda & Wellness Wanderer',
    badge: 'WELLNESS & NATURE ARCHETYPE',
    tagline: 'You travel to restore inner harmony, breathe in nature, and rejuvenate mind & body.',
    description:
      'Your travel DNA values deep rejuvenation, solar-powered houseboats drifting through calm lagoons, certified Ayurvedic therapies, morning meditation over misty tea hills, and nourishing organic cuisine.',
    traits: [
      { name: 'Mind-Body Balance', pct: 99 },
      { name: 'Holistic Ayurveda', pct: 96 },
      { name: 'Nature Rejuvenation', pct: 95 },
    ],
    matches: [
      {
        id: 'kerala-backwaters',
        name: 'Kerala Backwaters & Munnar Mist',
        region: 'Alleppey & Munnar, Kerala',
        country: 'India',
        matchPct: 99,
        priceINR: '₹38,000',
        duration: '6 Days / 5 Nights',
        safetyScore: '9.9 / 10 Solo Safe',
        bestSeason: 'October to March',
        highlights: ['Private Solar Houseboat Cruise', 'Organic Tea Plantation Walk', 'Daily Panchakarma & Yoga'],
        img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&q=85&auto=format&fit=crop',
      },
      {
        id: 'rishikesh-quest',
        name: 'Rishikesh Yogic Flow & Ganges River',
        region: 'Uttarakhand, Himalayas',
        country: 'India',
        matchPct: 96,
        priceINR: '₹24,000',
        duration: '5 Days / 4 Nights',
        safetyScore: '9.9 / 10 Solo Safe',
        bestSeason: 'September to April',
        highlights: ['Private Sunrise Yoga at Ghats', 'Parmarth Ganga Aarti', 'Organic Ayurvedic Farm Meals'],
        img: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=800&h=600&q=85&auto=format&fit=crop',
      },
      {
        id: 'meghalaya-roots',
        name: 'Meghalaya Living Roots & Azure Pools',
        region: 'Cherrapunji & Dawki',
        country: 'India',
        matchPct: 93,
        priceINR: '₹39,000',
        duration: '6 Days / 5 Nights',
        safetyScore: '9.9 / 10 Solo Safe',
        bestSeason: 'October to May',
        highlights: ['Double Decker Living Root Hike', 'Dawki Crystal Clear River', 'Eco Bamboo Treehouses'],
        img: 'https://images.unsplash.com/photo-1626014303757-646633783a30?w=800&h=600&q=85&auto=format&fit=crop',
      },
    ],
  },
}

export default function TravelStyle() {
  const navigate = useNavigate()
  const toast = useToast()
  usePageTitle('Travel Style & Persona Discovery — GlobeTrotter')

  const [step, setStep] = useState(0) // 0 = Dashboard/Intro, 1-4 = Quiz Steps, 5 = Archetype Result
  const [answers, setAnswers] = useState({
    landscape: 'mountain',
    pace: 'slow',
    budget: 'boutique',
    companion: 'solo',
  })

  // Computed Archetype
  const activeArchetype = useMemo(() => {
    const key = answers.landscape || 'mountain'
    return ARCHETYPES[key] || ARCHETYPES.mountain
  }, [answers.landscape])

  const handleSelectOption = (dimension, val) => {
    setAnswers((prev) => ({ ...prev, [dimension]: val }))
    if (step < 4) {
      setStep((s) => s + 1)
    } else {
      setStep(5)
      toast.success('✨ Your Travel Style Archetype & Curated Matches are ready!')
    }
  }

  const handlePlanInTrips = (dest) => {
    navigate('/trips', {
      state: {
        initialDest: `${dest.name}, ${dest.country}`,
        initialImg: dest.img,
        initialBudget: parseInt(dest.priceINR.replace(/[^0-9]/g, '')) || 45000,
      },
    })
  }

  return (
    <div className="ts-page-root">
      <Sidebar />

      <main className="ts-main-content">
        <div className="ts-scroll-container">
          {/* Top Header */}
          <header className="ts-top-header">
            <div className="ts-title-group">
              <div className="ts-badge-row">
                <span className="ts-badge-gold">TRAVEL DNA & PERSONALITY ENGINE</span>
                <span className="ts-badge-live">⚡ REAL-TIME SMART SUGGESTIONS</span>
              </div>
              <h1 className="ts-hero-title">Travel Style & Persona Discovery</h1>
              <p className="ts-hero-sub">
                Complete your personalized style assessment to unlock tailored destination recommendations and custom day-wise itineraries.
              </p>
            </div>

            {step !== 0 && (
              <button
                className="ts-btn-reset-quiz"
                onClick={() => {
                  setStep(0)
                  toast.info('Assessment restarted.')
                }}
              >
                ↻ Restart Assessment
              </button>
            )}
          </header>

          {/* ═════════════════════════════════════════════════════════════
              VIEW 0: DASHBOARD / OVERVIEW
          ═════════════════════════════════════════════════════════════ */}
          {step === 0 && (
            <div className="ts-overview-grid">
              {/* Left Hero Card */}
              <div className="ts-hero-assessment-card">
                <div className="tac-inner">
                  <span className="tac-sub-tag">PERSONALIZED DISCOVERY</span>
                  <h2 className="tac-title">What Kind of Explorer Are You?</h2>
                  <p className="tac-desc">
                    Answer 4 thoughtful questions regarding your ideal landscapes, daily cadence, budget tier, and companionship style. GlobeTrotter will calculate your unique Travel DNA and generate bespoke recommendations.
                  </p>

                  <div className="tac-points-row">
                    <div className="tac-point-item">
                      <span className="tac-bullet">✦</span>
                      <span>4 Curated Dimensions</span>
                    </div>
                    <div className="tac-point-item">
                      <span className="tac-bullet">✦</span>
                      <span>Instant Multi-City Suggestions</span>
                    </div>
                    <div className="tac-point-item">
                      <span className="tac-bullet">✦</span>
                      <span>Auto Itinerary Export</span>
                    </div>
                  </div>

                  <button className="tac-btn-start" onClick={() => setStep(1)}>
                    <span>Begin Style Assessment</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Right Current Archetype Snapshot */}
              <div className="ts-current-snapshot-card">
                <div className="sc-header">
                  <span className="sc-lbl">CURRENT ACTIVE DNA</span>
                  <span className="sc-match-pill">98% Accuracy</span>
                </div>

                <div className="sc-profile-box">
                  <span className="sc-archetype-badge">{activeArchetype.badge}</span>
                  <h3 className="sc-archetype-title">{activeArchetype.title}</h3>
                  <p className="sc-archetype-tagline">"{activeArchetype.tagline}"</p>
                </div>

                <div className="sc-traits-bars">
                  {activeArchetype.traits.map((t, idx) => (
                    <div key={idx} className="sc-trait-line">
                      <div className="sc-trait-hdr">
                        <span>{t.name}</span>
                        <span className="sc-trait-num">{t.pct}%</span>
                      </div>
                      <div className="sc-trait-track">
                        <div className="sc-trait-fill" style={{ width: `${t.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="sc-btn-view-matches" onClick={() => setStep(5)}>
                  View Curated Matches ({activeArchetype.matches.length}) →
                </button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              VIEW 1-4: MULTI-STEP QUIZ QUESTIONS
          ═════════════════════════════════════════════════════════════ */}
          {step >= 1 && step <= 4 && (
            <div className="ts-quiz-container">
              {/* Progress Bar */}
              <div className="ts-progress-wrap">
                <div className="ts-progress-labels">
                  <span className="ts-pl-left">Dimension {step} of 4</span>
                  <span className="ts-pl-right">{step * 25}% Complete</span>
                </div>
                <div className="ts-progress-track">
                  <div className="ts-progress-fill" style={{ width: `${step * 25}%` }} />
                </div>
              </div>

              {/* Question Box */}
              <div className="ts-question-window">
                <div className="tqw-header">
                  <span className="tqw-step-badge">STEP 0{step} / 04</span>
                  <h2 className="tqw-title">{QUESTIONS[step - 1].title}</h2>
                  <p className="tqw-sub">{QUESTIONS[step - 1].subtitle}</p>
                </div>

                <div className="tqw-options-grid">
                  {QUESTIONS[step - 1].options.map((opt) => {
                    const isSelected = answers[QUESTIONS[step - 1].dimension] === opt.val
                    return (
                      <div
                        key={opt.val}
                        className={`tqw-option-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectOption(QUESTIONS[step - 1].dimension, opt.val)}
                      >
                        <div className="opt-check-indicator">
                          {isSelected ? '✓' : ''}
                        </div>
                        <div className="opt-text-info">
                          <h4 className="opt-label">{opt.label}</h4>
                          <p className="opt-desc">{opt.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="tqw-nav-footer">
                  {step > 1 && (
                    <button className="tqw-btn-back" onClick={() => setStep((s) => s - 1)}>
                      ← Previous Step
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              VIEW 5: RESULTS & BESPOKE DESTINATION MATCHES
          ═════════════════════════════════════════════════════════════ */}
          {step === 5 && (
            <div className="ts-results-container">
              {/* Archetype Summary Hero */}
              <div className="ts-results-archetype-card">
                <div className="rac-left">
                  <span className="rac-badge">{activeArchetype.badge}</span>
                  <h2 className="rac-title">{activeArchetype.title}</h2>
                  <p className="rac-tagline">"{activeArchetype.tagline}"</p>
                  <p className="rac-desc">{activeArchetype.description}</p>

                  <div className="rac-actions-row">
                    <button className="rac-btn-retake" onClick={() => setStep(1)}>
                      ↻ Retake Assessment
                    </button>
                    <button className="rac-btn-destinations" onClick={() => navigate('/destinations')}>
                      Browse All 12 Curated Escapes →
                    </button>
                  </div>
                </div>

                <div className="rac-right-traits">
                  <h4 className="rac-traits-title">DNA Alignment Breakdown</h4>
                  <div className="rac-traits-list">
                    {activeArchetype.traits.map((tr, i) => (
                      <div key={i} className="rac-trait-item">
                        <div className="rac-ti-header">
                          <span>{tr.name}</span>
                          <span className="rac-ti-val">{tr.pct}%</span>
                        </div>
                        <div className="rac-ti-track">
                          <div className="rac-ti-fill" style={{ width: `${tr.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Curated Suggested Matches Header */}
              <div className="ts-matches-header">
                <div>
                  <h3 className="ts-matches-heading">Bespoke Matches For Your Travel DNA</h3>
                  <p className="ts-matches-sub">
                    Tailored according to your landscape preference, pace, and safety profile.
                  </p>
                </div>
              </div>

              {/* 3-Column Destination Matches Grid */}
              <div className="ts-matches-grid">
                {activeArchetype.matches.map((match) => (
                  <div key={match.id} className="ts-match-card">
                    <div className="mc-media-frame">
                      <img src={match.img} alt={match.name} className="mc-img" />
                      <div className="mc-score-badge">
                        <span>★ {match.matchPct}% Match</span>
                      </div>
                      <span className="mc-safety-badge">🛡️ {match.safetyScore}</span>
                    </div>

                    <div className="mc-content-body">
                      <div className="mc-title-row">
                        <h4 className="mc-name">{match.name}</h4>
                        <span className="mc-price">{match.priceINR}</span>
                      </div>
                      <p className="mc-region">{match.region}, {match.country}</p>

                      <div className="mc-inclusions-box">
                        <span className="mc-inc-lbl">SIGNATURE HIGHLIGHTS</span>
                        <ul className="mc-inc-list">
                          {match.highlights.map((h, i) => (
                            <li key={i}>✦ {h}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mc-meta-footer">
                        <span className="mc-meta-item">⏱️ {match.duration}</span>
                        <span className="mc-meta-item">🌤️ {match.bestSeason}</span>
                      </div>

                      <button className="mc-btn-plan" onClick={() => handlePlanInTrips(match)}>
                        <span>⚡ Plan in My Journeys</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
