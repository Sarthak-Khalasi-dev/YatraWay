import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import './Destinations.css'

const CATEGORIES = ['All', 'Beach', 'Mountains', 'City', 'Adventure', 'Culture', 'Wildlife']

const DESTINATIONS = [
  { name: 'Maldives',     country: 'South Asia',  cat: 'Beach',     rating: 4.9, price: '₹1,20,000', reviews: 320, tag: 'Trending',    img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=420&q=80&auto=format&fit=crop' },
  { name: 'Santorini',   country: 'Greece',       cat: 'City',      rating: 4.8, price: '₹95,000',  reviews: 280, tag: 'Popular',     img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=420&q=80&auto=format&fit=crop' },
  { name: 'Swiss Alps',  country: 'Switzerland',  cat: 'Mountains', rating: 4.9, price: '₹1,50,000', reviews: 410, tag: 'Bucket List', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=420&q=80&auto=format&fit=crop' },
  { name: 'Bali',        country: 'Indonesia',    cat: 'Culture',   rating: 4.7, price: '₹55,000',  reviews: 520, tag: 'Top Rated',   img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=420&q=80&auto=format&fit=crop' },
  { name: 'Machu Picchu',country: 'Peru',          cat: 'Adventure', rating: 4.8, price: '₹1,10,000', reviews: 195, tag: 'Bucket List', img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&h=420&q=80&auto=format&fit=crop' },
  { name: 'Kyoto',       country: 'Japan',         cat: 'Culture',   rating: 4.9, price: '₹1,30,000', reviews: 370, tag: 'Trending',    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=420&q=80&auto=format&fit=crop' },
  { name: 'Serengeti',   country: 'Tanzania',      cat: 'Wildlife',  rating: 4.8, price: '₹2,00,000', reviews: 160, tag: 'Exclusive',   img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=420&q=80&auto=format&fit=crop' },
  { name: 'Amalfi Coast',country: 'Italy',         cat: 'Beach',     rating: 4.7, price: '₹1,05,000', reviews: 290, tag: 'Popular',     img: 'https://images.unsplash.com/photo-1533104182429-4b31e8ae3e9e?w=600&h=420&q=80&auto=format&fit=crop' },
  { name: 'Patagonia',   country: 'Argentina',     cat: 'Adventure', rating: 4.9, price: '₹1,80,000', reviews: 130, tag: 'Hidden Gem',  img: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=420&q=80&auto=format&fit=crop' },
  { name: 'New York',    country: 'USA',           cat: 'City',      rating: 4.6, price: '₹1,40,000', reviews: 640, tag: 'Trending',    img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=420&q=80&auto=format&fit=crop' },
  { name: 'Leh Ladakh',  country: 'India',         cat: 'Mountains', rating: 4.8, price: '₹35,000',  reviews: 480, tag: 'Top Rated',   img: 'https://images.unsplash.com/photo-1581791538302-03537b9c97bf?w=600&h=420&q=80&auto=format&fit=crop' },
  { name: 'Queenstown',  country: 'New Zealand',   cat: 'Adventure', rating: 4.9, price: '₹1,70,000', reviews: 210, tag: 'Bucket List', img: 'https://images.unsplash.com/photo-1589802829985-817e51181b92?w=600&h=420&q=80&auto=format&fit=crop' },
]

function StarFill() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
function HeartFilled({ on }) {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill={on ? '#EF4444' : 'none'} stroke={on ? '#EF4444' : 'white'} strokeWidth="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
}

const TAG_COLORS = {
  'Trending':    { bg: 'rgba(99,102,241,0.15)',  color: '#6366F1' },
  'Popular':     { bg: 'rgba(16,185,129,0.15)',  color: '#10B981' },
  'Bucket List': { bg: 'rgba(212,168,67,0.15)',  color: '#D4A843' },
  'Top Rated':   { bg: 'rgba(239,68,68,0.15)',   color: '#EF4444' },
  'Exclusive':   { bg: 'rgba(139,92,246,0.15)',  color: '#8B5CF6' },
  'Hidden Gem':  { bg: 'rgba(20,184,166,0.15)',  color: '#14B8A6' },
}

export default function Destinations() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [activecat, setActivecat] = useState('All')
  const [liked, setLiked] = useState({})
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('rating')

  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t) }, [])

  const handleExplore = (dest) => {
    navigate('/trips', { state: { initialDest: `${dest.name}, ${dest.country}`, initialImg: dest.img } })
  }

  const filtered = DESTINATIONS
    .filter(d => activecat === 'All' || d.cat === activecat)
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'price' ? parseInt(a.price.replace(/\D/g,'')) - parseInt(b.price.replace(/\D/g,'')) : b.reviews - a.reviews)

  return (
    <div className={`pg-root ${mounted ? 'pg-on' : ''}`}>
      <Sidebar />
      <div className="pg-main">
        <header className="pg-header">
          <div><h1 className="pg-title">Destinations</h1><p className="pg-sub">Explore {DESTINATIONS.length} handpicked destinations worldwide</p></div>
          <div className="pg-header-r">
            <div className="pg-search"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            <select className="pg-sort" value={sort} onChange={e => setSort(e.target.value)}><option value="rating">Top Rated</option><option value="price">Price: Low</option><option value="reviews">Most Reviews</option></select>
          </div>
        </header>

        <div className="pg-scroll">
          <div className="dest-hero"><img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&h=500&q=80&auto=format&fit=crop" alt="Destinations" className="dest-hero-img" /><div className="dest-hero-overlay"><h2 className="dest-hero-h">Where do you want to go next?</h2><p className="dest-hero-p">From tropical beaches to alpine peaks — every dream destination awaits</p><div className="dest-hero-stats"><div className="dest-stat"><span className="dest-stat-num">50+</span><span className="dest-stat-lbl">Countries</span></div><div className="dest-stat-div"/><div className="dest-stat"><span className="dest-stat-num">200+</span><span className="dest-stat-lbl">Destinations</span></div><div className="dest-stat-div"/><div className="dest-stat"><span className="dest-stat-num">10k+</span><span className="dest-stat-lbl">Happy Travelers</span></div></div></div></div>
          <div className="cat-row">{CATEGORIES.map(c => (<button key={c} className={`cat-pill ${activecat === c ? 'cat-pill--on' : ''}`} onClick={() => setActivecat(c)}>{c}</button>))}</div>
          <div className="results-bar"><p className="results-count">{filtered.length} destinations found</p></div>
          <div className="dest-grid">{filtered.map((dest, i) => { const tagStyle = TAG_COLORS[dest.tag] || {}; return (<div className="dest-card" key={dest.name} style={{ animationDelay: `${i * 0.05}s`, cursor: 'pointer' }} onClick={() => handleExplore(dest)}><div className="dest-img-wrap"><img src={dest.img} alt={dest.name} className="dest-img" /><div className="dest-tag-wrap"><span className="dest-tag" style={{ background: tagStyle.bg, color: tagStyle.color }}>{dest.tag}</span></div><button className={`dest-heart ${liked[dest.name] ? 'dest-heart--on' : ''}`} onClick={(e) => { e.stopPropagation(); setLiked(p => ({ ...p, [dest.name]: !p[dest.name] })) }}><HeartFilled on={liked[dest.name]} /></button></div><div className="dest-info"><div className="dest-name-row"><div><p className="dest-name">{dest.name}</p><p className="dest-country"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{dest.country}</p></div><p className="dest-price">{dest.price}</p></div><div className="dest-bottom"><div className="dest-rating"><StarFill /><span className="dest-score">{dest.rating}</span><span className="dest-rev">({dest.reviews})</span></div><button className="dest-btn">Explore →</button></div></div></div>) })}</div>
          {filtered.length === 0 && (<div className="no-results"><span style={{ fontSize: 48 }}>🔍</span><p>No destinations found for "{search}"</p><button onClick={() => { setSearch(''); setActivecat('All') }}>Clear filters</button></div>)}
        </div>
      </div>
    </div>
  )
}
