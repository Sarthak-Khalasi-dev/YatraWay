import { TRIPS as TRIP_DATA, STATS, EXPLORE, statusLabel } from '../../data/mockData'
import { TRIP_IMGS, STAT_IMGS, EXPLORE_IMGS } from '../../data/images'

// patch images at runtime — keeps mockData.jsx as single source of truth for data
const TRIPS = [
  { ...TRIP_DATA[0], img: TRIP_IMGS.bali },
  { ...TRIP_DATA[1], img: TRIP_IMGS.santorini },
  { ...TRIP_DATA[2], img: TRIP_IMGS.kyoto },
  { ...TRIP_DATA[3], img: TRIP_IMGS.goa },
]

const STATS_PATCHED = STATS.map((s, i) => ({ ...s, img: STAT_IMGS[i] }))

const STATUS_COLORS = {
  upcoming: { bg: 'rgba(212,168,67,0.14)', color: '#B8860B', dot: '#D4A843' },
  planning: { bg: 'rgba(99,102,241,0.14)', color: '#5B5BD6', dot: '#6366F1' },
  wishlist: { bg: 'rgba(16,185,129,0.14)', color: '#059669', dot: '#10B981' },
}

function StarFill() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}

export default function TripList() {
  return (
    <section className="tl-section">
      <div className="tl-hd">
        <span className="tl-title">Upcoming Trips</span>
        <button className="tl-viewall">View All →</button>
      </div>
      <div className="tl-grid">
        {TRIPS.map((trip, i) => {
          const s = STATUS_COLORS[trip.status] || STATUS_COLORS.upcoming
          return (
            <div className="tl-card" key={trip.id} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="tl-img-wrap">
                <img src={trip.img} alt={trip.dest} className="tl-img" />
                <span className="tl-badge" style={{ background: s.bg, color: s.color }}>
                  <span className="tl-dot" style={{ background: s.dot }} />
                  {statusLabel(trip.status)}
                </span>
              </div>
              <div className="tl-body">
                <p className="tl-dest">{trip.dest}</p>
                <p className="tl-dates">{trip.dates}</p>
                <div className="tl-meta">
                  <span className="tl-days">{trip.days} days</span>
                  {trip.daysLeft && <span className="tl-left">{trip.daysLeft} days away</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
