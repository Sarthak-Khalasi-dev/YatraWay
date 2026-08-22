import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useToast } from '../context/ToastContext'
import { usePageTitle } from '../hooks/usePageTitle'
import './Favorites.css'

const INITIAL_FAVORITES = [
  {
    id: 'fav-ubud',
    name: 'Ubud, Bali',
    country: 'INDONESIA',
    category: 'Mountain',
    desc: 'Immerse yourself in the cultural heart of Bali, surrounded by emerald rice paddies and sacred temples.',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&h=700&q=85&auto=format&fit=crop',
    isHero: true,
  },
  {
    id: 'fav-santorini',
    name: 'Santorini, Greece',
    country: 'GREECE',
    category: 'Beach',
    desc: 'Iconic whitewashed cliffside villages overlooking the Aegean caldera and world-famous sunsets.',
    img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=1000&q=85&auto=format&fit=crop',
  },
  {
    id: 'fav-cinqueterre',
    name: 'Cinque Terre, Italy',
    country: 'ITALY',
    category: 'Beach',
    desc: 'Vibrant pastel fishing villages nestled dramatically along the rugged Italian Riviera coastline.',
    img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=700&q=85&auto=format&fit=crop',
  },
  {
    id: 'fav-kyoto',
    name: 'Kyoto, Japan',
    country: 'JAPAN',
    category: 'City',
    desc: 'Centuries-old wooden shrines, tranquil Zen rock gardens, and magnificent spring cherry blossoms.',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=700&q=85&auto=format&fit=crop',
  },
  {
    id: 'fav-ladakh',
    name: 'Pangong Tso & Ladakh',
    country: 'INDIA',
    category: 'Mountain',
    desc: 'Azure alpine lakes nestled at 14,000 ft beneath the towering snow peaks of the Indian Himalayas.',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=700&q=85&auto=format&fit=crop',
  },
  {
    id: 'fav-kerala',
    name: 'Alleppey Backwaters',
    country: 'INDIA',
    category: 'Beach',
    desc: 'Glide on traditional handcrafted wooden houseboats through serene palm-fringed lagoons.',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=700&q=85&auto=format&fit=crop',
  },
]

export default function Favorites() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All Spots')
  const [likedMap, setLikedMap] = useState(() => {
    const map = {}
    INITIAL_FAVORITES.forEach((f) => {
      map[f.id] = true
    })
    return map
  })

  const navigate = useNavigate()
  const toast = useToast()
  usePageTitle('Favorite Destinations — Wanderlust')

  const toggleHeart = (e, id, name) => {
    e.stopPropagation()
    setLikedMap((prev) => {
      const next = !prev[id]
      if (!next) {
        toast.info(`Removed ${name} from favorites`)
      } else {
        toast.success(`Added ${name} to favorites`)
      }
      return { ...prev, [id]: next }
    })
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('🔗 Shareable list link copied to clipboard!')
    } else {
      toast.success('🔗 List ready to share!')
    }
  }

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,Country,Category']
        .concat(favorites.filter((f) => likedMap[f.id]).map((f) => `"${f.name}","${f.country}","${f.category}"`))
        .join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'wanderlust_favorites.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('📥 Favorites exported to CSV!')
  }

  const filteredFavorites = useMemo(() => {
    return favorites.filter((item) => {
      const isLiked = likedMap[item.id] !== false
      if (!isLiked) return false

      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.country.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        activeFilter === 'All Spots' ||
        item.category.toLowerCase() === activeFilter.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [favorites, likedMap, search, activeFilter])

  return (
    <div className="fav-page-root">
      <Sidebar />

      <main className="fav-main-content">
        {/* ── TOP HEADER & SEARCH ── */}
        <header className="fav-top-header">
          <div className="fav-title-group">
            <h1 className="fav-hero-title">Favorite destinations</h1>
            <p className="fav-hero-sub">
              A curated collection of your future escapes and past inspirations. Ready when you are.
            </p>
          </div>

          <div className="fav-search-wrapper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C867A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="fav-search-input"
              placeholder="Search saved..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="fav-search-clear" onClick={() => setSearch('')}>
                ✕
              </button>
            )}
          </div>
        </header>

        {/* ── SCROLLABLE DESTINATION GRID ── */}
        <div className="fav-scroll-container">
          {filteredFavorites.length === 0 ? (
            <div className="fav-empty-state">
              <span className="empty-icon">🗺️</span>
              <h3>No saved destinations found</h3>
              <p>Try clearing your search or explore new places to save to your collection.</p>
              <button className="fav-explore-btn" onClick={() => navigate('/destinations')}>
                Explore Destinations →
              </button>
            </div>
          ) : (
            <div className="fav-editorial-grid">
              {filteredFavorites.map((item, index) => {
                const isFirst = index === 0
                return (
                  <div
                    key={item.id}
                    className={`fav-card-editorial ${isFirst ? 'fav-card-large' : ''}`}
                    onClick={() => navigate('/destinations', { state: { search: item.name } })}
                  >
                    <img src={item.img} alt={item.name} className="fav-card-bg-img" />
                    <div className="fav-card-gradient-overlay" />

                    {/* Top Heart Badge */}
                    <button
                      className="fav-heart-circle"
                      onClick={(e) => toggleHeart(e, item.id, item.name)}
                      title="Save / Unsave"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>

                    {/* Bottom Info Overlay */}
                    <div className="fav-card-bottom-info">
                      <div className="fav-country-tag">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{item.country}</span>
                      </div>

                      <h3 className="fav-destination-title">{item.name}</h3>

                      {isFirst && item.desc && (
                        <p className="fav-destination-desc">{item.desc}</p>
                      )}

                      {isFirst && (
                        <button
                          className="fav-book-stay-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate('/trips', { state: { initialDest: item.name, initialImg: item.img } })
                          }}
                        >
                          <span>Book Stay</span>
                          <span>→</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── BOTTOM ACTIONS & CATEGORY FILTER BAR ── */}
          <footer className="fav-bottom-action-bar">
            {/* Filter Pills */}
            <div className="fav-filter-pill-group">
              {['All Spots', 'Beach', 'Mountain', 'City'].map((tab) => (
                <button
                  key={tab}
                  className={`fav-filter-tab ${activeFilter === tab ? 'active' : ''}`}
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right Action Links */}
            <div className="fav-right-actions">
              <button className="fav-action-link" onClick={handleShare}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>SHARE LIST</span>
              </button>

              <button className="fav-action-link" onClick={handleExportCSV}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>EXPORT CSV</span>
              </button>
            </div>
          </footer>
        </div>

        {/* ── FLOATING PLUS ACTION BUTTON ── */}
        <button
          className="fav-fab-plus-btn"
          title="Add New Favorite"
          onClick={() => navigate('/destinations')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </main>
    </div>
  )
}
