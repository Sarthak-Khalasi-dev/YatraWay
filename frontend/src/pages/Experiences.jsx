import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import { SparkleIcon, MountainIcon, CultureIcon, LeafIcon, BeachIcon } from '../components/icons/LuxuryIcons'
import './Destinations.css'
import './Experiences.css'

const EXPERIENCES = [
  { name: 'Hot Air Balloon — Cappadocia', location: 'Turkey', cat: 'Adventure', duration: '3h', price: '₹15,000', rating: 4.9, reviews: 840, img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&q=80&auto=format&fit=crop', tag: 'Bestseller' },
  { name: 'Ayurvedic Spa & Houseboat Retreat', location: 'Kerala, India', cat: 'Wellness', duration: '1 Day', price: '₹4,500', rating: 4.8, reviews: 320, img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&q=80&auto=format&fit=crop', tag: 'Popular' },
  { name: 'Scuba Diving & Coral Safari', location: 'Havelock, Andaman', cat: 'Adventure', duration: '5h', price: '₹8,500', rating: 4.9, reviews: 560, img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&h=400&q=80&auto=format&fit=crop', tag: 'Bucket List' },
  { name: 'Pasta Making Masterclass', location: 'Rome, Italy', cat: 'Culture', duration: '2.5h', price: '₹6,800', rating: 4.7, reviews: 210, img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=400&q=80&auto=format&fit=crop', tag: 'Trending' },
  { name: 'Northern Lights Glass Igloo Safari', location: 'Lapland, Finland', cat: 'Nature', duration: '4h', price: '₹18,500', rating: 4.8, reviews: 430, img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&h=400&q=80&auto=format&fit=crop', tag: 'Exclusive' },
  { name: 'Traditional Uji Tea Ceremony', location: 'Kyoto, Japan', cat: 'Culture', duration: '3h', price: '₹7,200', rating: 4.9, reviews: 370, img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&q=80&auto=format&fit=crop', tag: 'Trending' },
]

const CATS = [
  { id: 'All', label: 'All Experiences', icon: SparkleIcon },
  { id: 'Adventure', label: 'Adventure', icon: MountainIcon },
  { id: 'Culture', label: 'Culture', icon: CultureIcon },
  { id: 'Wellness', label: 'Wellness', icon: LeafIcon },
  { id: 'Nature', label: 'Nature', icon: BeachIcon },
]

function StarFill() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}

const TAG_COLORS = {
  'Bestseller': { bg: 'rgba(212,168,67,0.15)', color: '#D4A843' },
  'Popular':    { bg: 'rgba(16,185,129,0.15)', color: '#10B981' },
  'Bucket List':{ bg: 'rgba(99,102,241,0.15)', color: '#6366F1' },
  'Trending':   { bg: 'rgba(239,68,68,0.15)',  color: '#EF4444' },
  'Exclusive':  { bg: 'rgba(139,92,246,0.15)', color: '#8B5CF6' },
}

/* ── Animation Variants ── */
const staggerGrid = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
}
const cardEnter = {
  initial: { opacity: 0, y: 26, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 25 } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
}
const headerEnter = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Experiences() {
  const [mounted, setMounted] = useState(false)
  const [cat, setCat] = useState('All')
  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t) }, [])

  const filtered = EXPERIENCES.filter(e => cat === 'All' || e.cat === cat)

  return (
    <div className={`pg-root ${mounted ? 'pg-on' : ''}`}>
      <Sidebar />
      <div className="pg-main">
        <motion.header className="pg-header" variants={headerEnter} initial="initial" animate="animate">
          <div>
            <h1 className="pg-title">Experiences</h1>
            <p className="pg-sub">Handpicked moments to make your journey unforgettable</p>
          </div>
        </motion.header>
        <div className="pg-scroll" style={{ padding:'0 24px 32px' }}>
          <motion.div
            className="cat-row"
            style={{ paddingTop:20 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {CATS.map(c => {
              const Icon = c.icon
              return (
                <motion.button
                  key={c.id}
                  className={`cat-pill ${cat===c.id?'cat-pill--on':''}`}
                  onClick={() => setCat(c.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {Icon && <Icon size={14} color="currentColor" />}
                  <span>{c.label}</span>
                </motion.button>
              )
            })}
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              className="exp-grid"
              style={{ marginTop:16 }}
              key={cat}
              variants={staggerGrid}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {filtered.map((exp) => {
                const ts = TAG_COLORS[exp.tag] || {}
                return (
                  <motion.div
                    className="exp-card"
                    key={exp.name}
                    variants={cardEnter}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  >
                    <div className="exp-img-wrap">
                      <img src={exp.img} alt={exp.name} className="exp-img" />
                      <span className="exp-tag" style={{ background:ts.bg, color:ts.color }}>{exp.tag}</span>
                    </div>
                    <div className="exp-body">
                      <p className="exp-name">{exp.name}</p>
                      <p className="exp-loc">📍 {exp.location} · ⏱ {exp.duration}</p>
                      <div className="exp-bottom">
                        <div>
                          <div className="dest-rating"><StarFill /><span className="dest-score">{exp.rating}</span><span className="dest-rev">({exp.reviews})</span></div>
                          <p className="exp-price">{exp.price} <span>/person</span></p>
                        </div>
                        <motion.button
                          className="dest-btn"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          Book Now
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
