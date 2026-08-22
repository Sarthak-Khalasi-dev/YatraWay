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

  return (
    <div className={`pg-root ${mounted ? 'pg-on' : ''}`}>
      <Sidebar />
      <div className="pg-main">
        <header className="pg-header">
          <div>
            <h1 className="pg-title">Favorites ❤️</h1>
            <p className="pg-sub">{favs.length} destinations you love</p>
          </div>
        </header>
        <div className="pg-scroll" style={{ padding:'20px 24px 32px' }}>
          {favs.length === 0 && (
            <div className="no-results" style={{ paddingTop:80 }}>
              <span style={{ fontSize:52 }}>💔</span>
              <p>No favorites yet — start exploring!</p>
            </div>
          )}
          <div className="fav-grid">
            {favs.map((f, i) => (
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
                  <button className="trip-view-btn" style={{ marginTop:10 }}>Plan This Trip →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
