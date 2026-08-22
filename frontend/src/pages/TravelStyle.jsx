import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { CompassIcon, MountainIcon, BeachIcon, CultureIcon, SparkleIcon, PlaneIcon, CheckCircleIcon } from '../components/icons/LuxuryIcons'
import './TravelStyle.css'

const QUESTIONS = [
  { id: 1, q: 'What\'s your ideal travel vibe?', options: [
    { label:'Beach & Relaxation', val:'beach' },
    { label:'Adventure & Trekking', val:'adventure' },
    { label:'Culture & Heritage', val:'culture' },
    { label:'City & Architecture', val:'city' },
  ]},
  { id: 2, q: 'How do you prefer to travel?', options: [
    { label:'Flight Journeys', val:'fly' },
    { label:'Scenic Train Routes', val:'train' },
    { label:'Scenic Road Trips', val:'road' },
    { label:'Ocean Cruises', val:'cruise' },
  ]},
  { id: 3, q: 'Your budget style?', options: [
    { label:'Smart Explorer Budget', val:'budget' },
    { label:'Mid-Range Comfort', val:'mid' },
    { label:'Luxury & Boutique', val:'luxury' },
    { label:'Experiential & Flexible', val:'flexible' },
  ]},
  { id: 4, q: 'Trip duration you prefer?', options: [
    { label:'Weekend Getaway', val:'weekend' },
    { label:'1–2 Week Voyage', val:'week' },
    { label:'Month-Long Exploration', val:'month' },
    { label:'Long-Term Journey', val:'longterm' },
  ]},
  { id: 5, q: 'Who do you usually travel with?', options: [
    { label:'Solo Explorer', val:'solo' },
    { label:'Partner & Couple', val:'couple' },
    { label:'Family Journey', val:'family' },
    { label:'Travel Squad & Friends', val:'friends' },
  ]},
]

const STYLES = {
  beach:     { title:'The Beach Wanderer', desc:'You crave sun, sand, and the sound of waves. Tropical paradises like Maldives, Bali, and Phuket are calling your name!' },
  adventure: { title:'The Adventure Seeker', desc:'Adrenaline is your best travel companion. From Patagonia to Nepal, you thrive where the trail ends!' },
  culture:   { title:'The Heritage Explorer', desc:'You live for ancient ruins, local festivals, and authentic cuisine. Kyoto, Rome, and Istanbul are your playgrounds!' },
  city:      { title:'The Urban Nomad', desc:'You love the energy of cities, rooftop skyline views, street culture, and hidden art districts. Tokyo, NYC, or Paris? All three!' },
}

const SAVED_DESTINATIONS = [
  { id:1, name:'Maldives', category:'Beach', match:98, img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&q=80&auto=format&fit=crop' },
  { id:2, name:'Bali',     category:'Beach', match:95, img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&q=80&auto=format&fit=crop' },
  { id:3, name:'Phuket',   category:'Beach', match:91, img:'https://images.unsplash.com/photo-1589394815804-964ed7be2eb5?w=400&h=300&q=80&auto=format&fit=crop' },
]

export default function TravelStyle() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(0) // 0=intro, 1-5=questions, 6=result
  const [answers, setAnswers] = useState({})
  const [animating, setAnimating] = useState(false)

  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t) }, [])

  const answer = (val) => {
    const newAnswers = { ...answers, [step]: val }
    setAnswers(newAnswers)
    setAnimating(true)
    setTimeout(() => {
      setStep(s => s + 1)
      setAnimating(false)
    }, 300)
  }

  const handleExplore = (d) => {
    navigate('/trips', { state: { initialDest: d.name, initialImg: d.img } })
  }

  const progress = step === 0 ? 0 : step > 5 ? 100 : (step / 5) * 100

  const getStyle = () => {
    const counts = Object.values(answers).reduce((acc, v) => { acc[v] = (acc[v]||0)+1; return acc }, {})
    const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]
    return STYLES[top] || STYLES.beach
  }

  return (
    <div className={`page-shell ${mounted ? 'mounted' : ''}`}>
      <Sidebar />
      <div className="page-body">
        <Topbar title="Travel Style" subtitle="Discover your unique traveler personality" />
        <div className="page-scroll">
          {step === 0 && (
            <div className="ts-intro">
              <div className="ts-intro-card">
                <div className="ts-intro-emoji" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <CompassIcon size={44} color="#D4A843" />
                </div>
                <h1 className="ts-intro-title">What Kind of Traveler Are You?</h1>
                <p className="ts-intro-desc">Answer 5 quick questions and we'll discover your unique travel personality and suggest perfect destinations for you!</p>
                <div className="ts-intro-features">
                  {['5 quick questions','Personalized destinations','Save your profile'].map(f => (
                    <div key={f} className="ts-feature">
                      <span className="ts-feature-dot" />{f}
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary" style={{ padding:'14px 36px', fontSize:15, marginTop:8 }} onClick={() => setStep(1)}>
                  Start Quiz →
                </button>
              </div>
              <div className="ts-saved">
                <h2 className="sec-title" style={{ marginBottom:14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BeachIcon size={18} color="#D4A843" /> Your Current Style: Beach Wanderer
                </h2>
                <div className="ts-match-grid">
                  {SAVED_DESTINATIONS.map(d => (
                    <div key={d.id} className="ts-match-card" onClick={() => handleExplore(d)} style={{ cursor:'pointer' }}>
                      <img src={d.img} alt={d.name} className="ts-match-img" />
                      <div className="ts-match-info">
                        <p className="ts-match-name">{d.name}</p>
                        <div className="ts-match-bar-wrap">
                          <div className="ts-match-bar">
                            <div className="ts-match-fill" style={{ width:`${d.match}%` }} />
                          </div>
                          <span className="ts-match-pct">{d.match}% match</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step >= 1 && step <= 5 && (
            <div className={`ts-quiz ${animating ? 'ts-quiz--exit' : 'ts-quiz--enter'}`} key={step}>
              <div className="ts-progress-row">
                <span className="ts-progress-label">Question {step} of 5</span>
                <span className="ts-progress-label">{Math.round(progress)}%</span>
              </div>
              <div className="ts-progress-bar">
                <div className="ts-progress-fill" style={{ width:`${progress}%` }} />
              </div>
              <div className="ts-question-card">
                <p className="ts-question-num">Question {step}/5</p>
                <h2 className="ts-question-text">{QUESTIONS[step-1].q}</h2>
                <div className="ts-options">
                  {QUESTIONS[step-1].options.map(opt => (
                    <button
                      key={opt.val}
                      className={`ts-option ${answers[step]===opt.val?'ts-option--selected':''}`}
                      onClick={() => answer(opt.val)}
                    >
                      <span className="ts-option-label">{opt.label}</span>
                      {answers[step]===opt.val && <span className="ts-option-check">✓</span>}
                    </button>
                  ))}
                </div>
                {step > 1 && (
                  <button className="btn btn-ghost" style={{ marginTop:16, fontSize:13 }} onClick={() => setStep(s => s-1)}>
                    ← Back
                  </button>
                )}
              </div>
            </div>
          )}
          {step === 6 && (
            <div className="ts-result">
              <div className="ts-result-card">
                <div className="ts-result-confetti" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <SparkleIcon size={38} color="#D4A843" />
                </div>
                <h1 className="ts-result-title">{getStyle().title}</h1>
                <p className="ts-result-desc">{getStyle().desc}</p>
                <div className="ts-result-actions">
                  <button className="btn btn-primary" onClick={() => { setStep(0); setAnswers({}) }}>Retake Quiz</button>
                  <button className="btn btn-gold" onClick={() => navigate('/destinations')}>Explore Matches →</button>
                </div>
              </div>
              <div className="ts-match-grid" style={{ maxWidth:600 }}>
                {SAVED_DESTINATIONS.map(d => (
                  <div key={d.id} className="ts-match-card" onClick={() => handleExplore(d)} style={{ cursor:'pointer' }}>
                    <img src={d.img} alt={d.name} className="ts-match-img" />
                    <div className="ts-match-info">
                      <p className="ts-match-name">{d.name}</p>
                      <div className="ts-match-bar-wrap">
                        <div className="ts-match-bar">
                          <div className="ts-match-fill" style={{ width:`${d.match}%` }} />
                        </div>
                        <span className="ts-match-pct">{d.match}% match</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
