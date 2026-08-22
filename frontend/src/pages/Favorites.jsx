import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { useStorage } from '../context/StorageContext'
import './Destinations.css'
import './Favorites.css'

function StarFill() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}

export default function Favorites() {
  const [mounted, setMounted] = useState(false)
  const [favs, setFavs] = useState([])
  const { favsStore } = useStorage()

  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t) }, [])
  useEffect(() => { if (favsStore) setFavs(favsStore.getAll()) }, [favsStore])

  const handleRemove = (id) => {
    favsStore.remove(id)
    setFavs(favsStore.getAll())
  }

  const displayFavs = favs.length > 0 ? favs : [
    { id: 'fav_1', name: 'Ladakh High-Pass & Pangong Oasis', country: 'India', rating: 4.9, price: '₹45,000', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=400&q=80&auto=format&fit=crop', note: 'Milky Way stargazing and monastery trails' },
    { id: 'fav_2', name: 'Swiss Alps Expedition', country: 'Switzerland', rating: 4.9, price: '₹1,50,000', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&q=80&auto=format&fit=crop', note: 'Matterhorn alpine chalet retreat' },
    { id: 'fav_3', name: 'Kyoto Heritage Trail', country: 'Japan', rating: 5.0, price: '₹1,30,000', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&q=80&auto=format&fit=crop', note: 'Ancient shrines & bamboo groves' },
    { id: 'fav_4', name: 'Kerala Backwaters Houseboat', country: 'India', rating: 5.0, price: '₹38,000', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&q=80&auto=format&fit=crop', note: 'Solar houseboat & Ayurvedic wellness' },
  ]

  return (
    <div className={`pg-root ${mounted ? 'pg-on' : ''}`}>
      <Sidebar />
      <div className="pg-main">
        <header className="pg-header">
          <div>
            <h1 className="pg-title">Favorites</h1>
            <p className="pg-sub">{displayFavs.length} curated destinations you love</p>
          </div>
        </header>
        <div className="pg-scroll" style={{ padding:'20px 24px 32px' }}>
          <div className="fav-grid">
            {displayFavs.map((f, i) => (
              <div className="fav-card" key={f.id || f.name} style={{ animationDelay:`${i*0.07}s` }}>
                <div className="fav-img-wrap">
                  <img src={f.img} alt={f.name} className="fav-img" />
                  <button className="fav-remove" onClick={() => handleRemove(f.id || f.name)} title="Remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div className="fav-info">
                  <p className="fav-name">{f.name}</p>
                  <p className="dest-country">📍 {f.country}</p>
                  <p className="fav-note">{f.note}</p>
                  <div className="fav-bottom">
                    <div className="dest-rating"><StarFill /><span className="dest-score">{f.rating}</span></div>
                    <p className="dest-price">{f.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
