import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { fetchTrips, createTrip, updateTrip, deleteTrip } from '../store/slices/tripSlice'
import { useToast } from '../context/ToastContext'
import { usePageTitle } from '../hooks/usePageTitle'
import './Trips.css'

const TABS = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Wishlist']

const STATUS_STYLE = {
  'Upcoming':  { bg: 'rgba(212,168,67,0.12)',  color: '#B8860B',  dot: '#D4A843' },
  'Ongoing':   { bg: 'rgba(16,185,129,0.12)',  color: '#059669',  dot: '#10B981' },
  'Completed': { bg: 'rgba(99,102,241,0.12)',  color: '#5B5BD6',  dot: '#6366F1' },
  'Wishlist':  { bg: 'rgba(239,68,68,0.12)',   color: '#DC2626',  dot: '#EF4444' },
}

const IMG_SEEDS = ['bali','santorini','kyoto','goa','maldives','paris','tokyo','barca','dubai','swiss']
const BLANK_FORM = {
  dest: '', dates: '', days: '', status: 'Upcoming', budget: '',
  spent: '₹0', members: 2, progress: 0, notes: '',
  img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&q=80&auto=format&fit=crop', activities: '',
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function TripForm({ initial, onSave, onClose, initialData }) {
  const [form, setForm] = useState(initial || { ...BLANK_FORM, ...initialData })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const trip = {
      ...form,
      days: parseInt(form.days) || 1,
      members: parseInt(form.members) || 1,
      progress: parseInt(form.progress) || 0,
      activities: typeof form.activities === 'string'
        ? form.activities.split(',').map(a => a.trim()).filter(Boolean)
        : form.activities,
      img: form.img || `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop`,
    }
    onSave(trip)
    onClose()
  }

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <div className="tf-grid">
        <div className="tf-field">
          <label>Destination *</label>
          <input required placeholder="e.g. Bali, Indonesia" value={form.dest} onChange={e => set('dest', e.target.value)} />
        </div>
        <div className="tf-field">
          <label>Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}>
            {['Upcoming','Ongoing','Completed','Wishlist'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="tf-field">
          <label>Dates</label>
          <input placeholder="e.g. 20 May — 02 Jun 2024" value={form.dates} onChange={e => set('dates', e.target.value)} />
        </div>
        <div className="tf-field">
          <label>Duration (days)</label>
          <input type="number" min="1" placeholder="7" value={form.days} onChange={e => set('days', e.target.value)} />
        </div>
        <div className="tf-field">
          <label>Budget</label>
          <input placeholder="₹50,000" value={form.budget} onChange={e => set('budget', e.target.value)} />
        </div>
        <div className="tf-field">
          <label>Spent</label>
          <input placeholder="₹0" value={form.spent} onChange={e => set('spent', e.target.value)} />
        </div>
        <div className="tf-field">
          <label>Members</label>
          <input type="number" min="1" placeholder="2" value={form.members} onChange={e => set('members', e.target.value)} />
        </div>
        <div className="tf-field">
          <label>Progress (%)</label>
          <input type="number" min="0" max="100" placeholder="0" value={form.progress} onChange={e => set('progress', e.target.value)} />
        </div>
        <div className="tf-field tf-full">
          <label>Activities (comma-separated)</label>
          <input placeholder="Surfing, Temple Tour, Rice Terraces"
            value={Array.isArray(form.activities) ? form.activities.join(', ') : form.activities}
            onChange={e => set('activities', e.target.value)} />
        </div>
        <div className="tf-field tf-full">
          <label>Notes</label>
          <textarea rows="2" placeholder="Any notes for this trip..." value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
      </div>
      <div className="tf-actions">
        <button type="button" className="tf-btn-cancel" onClick={onClose}>Cancel</button>
        <button type="submit" className="tf-btn-save">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Save Trip
        </button>
      </div>
    </form>
  )
}

export default function Trips() {
  const location = useLocation()
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState('All')
  const [view, setView] = useState('grid')
  const [showAdd, setShowAdd] = useState(false)
  const [editTrip, setEditTrip] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [initialTripData, setInitialTripData] = useState(null)
  
  const dispatch = useDispatch()
  const { trips, loading } = useSelector((state) => state.trips)
  const toast = useToast()
  usePageTitle('My Trips')

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40)
    dispatch(fetchTrips())

    if (location.state?.initialDest) {
      setInitialTripData({
        dest: location.state.initialDest,
        img: location.state.initialImg,
      })
      setShowAdd(true)
      // Clear state after reading to prevent re-opening on refresh
      window.history.replaceState({}, document.title)
    }

    return () => clearTimeout(t)
  }, [dispatch, location.state])

  const handleAdd = async (trip) => {
    const result = await dispatch(createTrip(trip))
    if (createTrip.fulfilled.match(result)) {
      toast.success(`✈️ Trip to ${trip.dest} added!`)
    }
  }

  const handleEdit = async (trip) => {
    const result = await dispatch(updateTrip({ id: trip._id, tripData: trip }))
    if (updateTrip.fulfilled.match(result)) {
      toast.success('✏️ Trip updated successfully')
    }
  }

  const handleDeleteConfirmed = async (id) => {
    const result = await dispatch(deleteTrip(id))
    if (deleteTrip.fulfilled.match(result)) {
      setDeleteId(null)
      toast.info('🗑️ Trip removed')
    }
  }

  const filtered = trips.filter(t => tab === 'All' || t.status === tab)

  const SUMMARY = [
    { label: 'Total Trips',   value: trips.length,                                     icon: '✈️' },
    { label: 'Upcoming',      value: trips.filter(t=>t.status==='Upcoming').length,     icon: '🗓️' },
    { label: 'Completed',     value: trips.filter(t=>t.status==='Completed').length,    icon: '✅' },
    { label: 'Wishlist',      value: trips.filter(t=>t.status==='Wishlist').length,     icon: '❤️' },
  ]

  return (
    <div className={`pg-root ${mounted ? 'pg-on' : ''}`}>
      <Sidebar />
      <div className="pg-main">
        <header className="pg-header">
          <div><h1 className="pg-title">My Trips</h1><p className="pg-sub">All your journeys — past, present, and future</p></div>
          <div className="trips-header-r">
            <div className="view-toggle">
              {['grid','list'].map(v => (
                <button key={v} className={`view-btn ${view===v?'view-btn--on':''}`} onClick={() => setView(v)}>
                  {v === 'grid'
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  }
                </button>
              ))}
            </div>
            <button className="new-trip-btn" onClick={() => setShowAdd(true)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>New Trip</button>
          </div>
        </header>

        <div className="pg-scroll" style={{ padding: '0 24px 32px' }}>
          <div className="trip-summary" style={{ paddingTop: 20 }}>
            {SUMMARY.map((s, i) => (
              <div className="sum-card" key={s.label} style={{ animationDelay: `${i*0.06}s` }}><span className="sum-icon">{s.icon}</span><p className="sum-val">{s.value}</p><p className="sum-lbl">{s.label}</p></div>
            ))}
          </div>

          <div className="trip-tabs">
            {TABS.map(t => (
              <button key={t} className={`trip-tab ${tab===t?'trip-tab--on':''}`} onClick={() => setTab(t)}>{t}<span className="trip-tab-count">{t==='All' ? trips.length : trips.filter(x=>x.status===t).length}</span></button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'100px 0' }}><span className="spinner" /></div>
          ) : view === 'grid' ? (
            <div className="trips-grid">
              {filtered.map((trip, i) => {
                const s = STATUS_STYLE[trip.status] || STATUS_STYLE['Upcoming']
                return (
                  <div className="trip-card" key={trip._id} style={{ animationDelay: `${i*0.07}s` }}>
                    <div className="trip-img-wrap">
                      <img src={trip.img || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80&auto=format&fit=crop'} alt={trip.dest} className="trip-img" />
                      <div className="trip-status-badge" style={{ background: s.bg, color: s.color }}><span className="trip-dot" style={{ background: s.dot }} />{trip.status}</div>
                      <div className="trip-card-actions">
                        <button className="tc-action-btn tc-edit" title="Edit" onClick={() => setEditTrip(trip)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        <button className="tc-action-btn tc-delete" title="Delete" onClick={() => setDeleteId(trip._id)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>
                      </div>
                    </div>
                    <div className="trip-body">
                      <p className="trip-dest">{trip.dest}</p><p className="trip-dates"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{trip.dates} {trip.days ? `· ${trip.days} days` : ''}</p>
                      {trip.activities?.length > 0 && <div className="trip-activities">{trip.activities.slice(0,3).map(a => <span key={a} className="act-chip">{a}</span>)}</div>}
                      <div className="trip-budget-row"><div><p className="trip-budget-lbl">Budget</p><p className="trip-budget-val">{trip.budget || '—'}</p></div><div><p className="trip-budget-lbl">Spent</p><p className="trip-budget-val">{trip.spent || '₹0'}</p></div><div><p className="trip-budget-lbl">Members</p><p className="trip-budget-val">👥 {trip.members || 1}</p></div></div>
                      <div className="trip-progress-wrap"><div className="trip-progress-bar"><div className="trip-progress-fill" style={{ width: `${trip.progress}%` }} /></div><span className="trip-progress-pct">{trip.progress}%</span></div>
                      {trip.notes && <p style={{ fontSize:12, color:'var(--text-3)', marginTop:8 }}>📝 {trip.notes}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="trips-list-view">
              {filtered.map((trip, i) => {
                const s = STATUS_STYLE[trip.status] || STATUS_STYLE['Upcoming']
                return (
                  <div className="trip-list-row" key={trip._id} style={{ animationDelay: `${i*0.05}s` }}>
                    <img src={trip.img || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80&auto=format&fit=crop'} alt={trip.dest} className="trip-list-img" />
                    <div className="trip-list-info"><p className="trip-dest">{trip.dest}</p><p className="trip-dates" style={{ marginTop: 3 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{trip.dates} {trip.days ? `· ${trip.days} days` : ''}</p></div>
                    <div className="trip-list-meta"><span className="trip-status-badge" style={{ background: s.bg, color: s.color }}><span className="trip-dot" style={{ background: s.dot }} />{trip.status}</span><p className="trip-budget-val" style={{ marginTop: 6, textAlign:'right' }}>{trip.budget || '—'}</p></div>
                    <div className="trip-list-bar"><div className="trip-progress-bar" style={{ width: 100 }}><div className="trip-progress-fill" style={{ width: `${trip.progress}%` }} /></div><span className="trip-progress-pct">{trip.progress}%</span></div>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="tc-action-btn tc-edit" title="Edit" onClick={() => setEditTrip(trip)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button className="tc-action-btn tc-delete" title="Delete" onClick={() => setDeleteId(trip._id)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {filtered.length === 0 && !loading && (
            <div className="no-results"><span style={{ fontSize: 48 }}>🗺️</span><p>No {tab.toLowerCase()} trips yet</p><button onClick={() => tab === 'All' ? setShowAdd(true) : setTab('All')}>{tab === 'All' ? 'Add your first trip' : 'View all trips'}</button></div>
          )}
        </div>
      </div>

      {showAdd && <Modal title="Plan a New Trip ✈️" onClose={() => setShowAdd(false)}><TripForm onSave={handleAdd} onClose={() => setShowAdd(false)} initialData={initialTripData} /></Modal>}
      {editTrip && <Modal title="Edit Trip ✏️" onClose={() => setEditTrip(null)}><TripForm initial={{ ...editTrip, activities: editTrip.activities.join(', ') }} onSave={handleEdit} onClose={() => setEditTrip(null)} /></Modal>}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="confirm-box" onClick={e => e.stopPropagation()}><span style={{ fontSize:36 }}>🗑️</span><h3>Delete this trip?</h3><p>This action cannot be undone.</p><div className="confirm-actions"><button className="tf-btn-cancel" onClick={() => setDeleteId(null)}>Keep It</button><button className="tf-btn-danger" onClick={() => handleDeleteConfirmed(deleteId)}>Delete</button></div></div></div>
      )}
    </div>
  )
}
