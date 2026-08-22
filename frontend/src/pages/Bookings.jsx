import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { useStorage } from '../context/StorageContext'
import './Bookings.css'

const TABS = ['All', 'Flights', 'Hotels', 'Activities']

const STATUS_STYLE = {
  'Confirmed': { bg: 'rgba(16,185,129,0.12)', color: '#059669', dot: '#10B981' },
  'Pending':   { bg: 'rgba(245,158,11,0.12)', color: '#D97706', dot: '#F59E0B' },
  'Cancelled': { bg: 'rgba(239,68,68,0.12)',  color: '#DC2626', dot: '#EF4444' },
}

const TYPE_ICON = { Flights:'✈️', Hotels:'🏨', Activities:'🎯' }
const BLANK_BOOKING = {
  type:'Flights', title:'', detail:'', date:'', time:'',
  status:'Confirmed', price:'', ref:'', duration:'',
  img:'https://picsum.photos/seed/travel/600/400', icon:'✈️',
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

function BookingForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || BLANK_BOOKING)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...form, icon: TYPE_ICON[form.type] || '📋' })
    onClose()
  }

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <div className="tf-grid">
        <div className="tf-field">
          <label>Type *</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            {['Flights','Hotels','Activities'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="tf-field">
          <label>Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}>
            {['Confirmed','Pending','Cancelled'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="tf-field tf-full">
          <label>Title *</label>
          <input required placeholder="e.g. BLR → DPS (Bali)" value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div className="tf-field tf-full">
          <label>Detail</label>
          <input placeholder="e.g. IndiGo · 6E-1234 · Economy" value={form.detail} onChange={e => set('detail', e.target.value)} />
        </div>
        <div className="tf-field">
          <label>Date</label>
          <input placeholder="20 May 2024" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div className="tf-field">
          <label>Time</label>
          <input placeholder="06:30 AM" value={form.time} onChange={e => set('time', e.target.value)} />
        </div>
        <div className="tf-field">
          <label>Price</label>
          <input placeholder="₹18,500" value={form.price} onChange={e => set('price', e.target.value)} />
        </div>
        <div className="tf-field">
          <label>Duration</label>
          <input placeholder="5h 15m" value={form.duration} onChange={e => set('duration', e.target.value)} />
        </div>
        <div className="tf-field tf-full">
          <label>Reference Number</label>
          <input placeholder="IGO-2024-BLR-DPS" value={form.ref} onChange={e => set('ref', e.target.value)} />
        </div>
      </div>
      <div className="tf-actions">
        <button type="button" className="tf-btn-cancel" onClick={onClose}>Cancel</button>
        <button type="submit" className="tf-btn-save">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Save Booking
        </button>
      </div>
    </form>
  )
}

export default function Bookings() {
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [bookings, setBookings] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editBk, setEditBk] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const { bookingsStore } = useStorage()

  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t) }, [])

  useEffect(() => {
    if (bookingsStore) setBookings(bookingsStore.getAll())
  }, [bookingsStore])

  const refresh = () => setBookings(bookingsStore.getAll())

  const handleAdd = (bk) => { bookingsStore.add(bk); refresh() }
  const handleEdit = (bk) => { bookingsStore.update(bk.id, bk); refresh(); setEditBk(null) }
  const handleDelete = (id) => { bookingsStore.remove(id); refresh(); setDeleteId(null) }

  const filtered = bookings.filter(b => tab === 'All' || b.type === tab)
  const totalSpend = bookings.reduce((acc, b) => {
    const n = parseInt((b.price || '').replace(/[₹,]/g, ''))
    return acc + (isNaN(n) ? 0 : n)
  }, 0)

  return (
    <div className={`pg-root ${mounted ? 'pg-on' : ''}`}>
      <Sidebar />
      <div className="pg-main">
        <header className="pg-header">
          <div>
            <h1 className="pg-title">Bookings</h1>
            <p className="pg-sub">Manage all your reservations in one place</p>
          </div>
          <button className="new-trip-btn" style={{ padding:'9px 18px', fontSize:13.5 }} onClick={() => setShowAdd(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Booking
          </button>
        </header>

        <div className="pg-scroll" style={{ padding:'0 24px 32px' }}>

          {/* Summary */}
          <div className="bk-summary" style={{ paddingTop:20 }}>
            <div className="bk-sum-card bk-sum-big">
              <p className="bk-sum-label">Total Bookings</p>
              <p className="bk-sum-big-val">{bookings.length}</p>
              <div className="bk-sum-sub-row">
                <span>✅ {bookings.filter(b=>b.status==='Confirmed').length} Confirmed</span>
                <span>⏳ {bookings.filter(b=>b.status==='Pending').length} Pending</span>
              </div>
            </div>
            <div className="bk-sum-card">
              <p className="bk-sum-label">Flights</p>
              <p className="bk-sum-val">✈️ {bookings.filter(b=>b.type==='Flights').length}</p>
            </div>
            <div className="bk-sum-card">
              <p className="bk-sum-label">Hotels</p>
              <p className="bk-sum-val">🏨 {bookings.filter(b=>b.type==='Hotels').length}</p>
            </div>
            <div className="bk-sum-card">
              <p className="bk-sum-label">Activities</p>
              <p className="bk-sum-val">🎯 {bookings.filter(b=>b.type==='Activities').length}</p>
            </div>
            <div className="bk-sum-card bk-sum-gold">
              <p className="bk-sum-label" style={{ color:'rgba(255,255,255,0.7)' }}>Total Spend</p>
              <p className="bk-sum-val" style={{ color:'white', fontSize:18 }}>₹{totalSpend >= 1000 ? `${(totalSpend/1000).toFixed(0)}k` : totalSpend}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="trip-tabs" style={{ marginBottom:18 }}>
            {TABS.map(t => (
              <button key={t} className={`trip-tab ${tab===t?'trip-tab--on':''}`} onClick={() => setTab(t)}>
                {t}
                <span className="trip-tab-count">{t==='All'?bookings.length:bookings.filter(b=>b.type===t).length}</span>
              </button>
            ))}
          </div>

          {/* Booking cards */}
          <div className="bk-list">
            {filtered.map((bk, i) => {
              const s = STATUS_STYLE[bk.status] || STATUS_STYLE['Confirmed']
              const isOpen = expanded === bk.id
              return (
                <div className={`bk-card ${isOpen?'bk-card--open':''}`} key={bk.id} style={{ animationDelay:`${i*0.06}s` }}>
                  <div className="bk-main-row" onClick={() => setExpanded(isOpen ? null : bk.id)}>
                    <img src={bk.img || 'https://picsum.photos/seed/booking/600/400'} alt={bk.title} className="bk-img" />
                    <div className="bk-info">
                      <div className="bk-info-top">
                        <span className="bk-type-chip">{bk.icon || '📋'} {bk.type}</span>
                        <span className="bk-status" style={{ background:s.bg, color:s.color }}>
                          <span className="trip-dot" style={{ background:s.dot }} />{bk.status}
                        </span>
                      </div>
                      <p className="bk-title">{bk.title}</p>
                      <p className="bk-detail">{bk.detail}</p>
                      <div className="bk-meta">
                        {bk.date && <span>📅 {bk.date}</span>}
                        {bk.time && <span>🕐 {bk.time}</span>}
                        {bk.duration && <span>⏱ {bk.duration}</span>}
                      </div>
                    </div>
                    <div className="bk-right">
                      <p className="bk-price">{bk.price}</p>
                      <p className="bk-ref">Ref: {bk.ref || '—'}</p>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" style={{ transform: isOpen?'rotate(180deg)':'none', transition:'0.2s', marginTop:8 }}><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="bk-expand">
                      <div className="bk-actions">
                        <button className="bk-action-btn bk-action-primary">📄 Download Voucher</button>
                        <button className="bk-action-btn" onClick={() => { setEditBk(bk); setExpanded(null) }}>✏️ Edit Booking</button>
                        <button className="bk-action-btn bk-action-danger" onClick={() => { setDeleteId(bk.id); setExpanded(null) }}>❌ Cancel Booking</button>
                      </div>
                      {bk.ref && (
                        <div className="bk-ref-full">
                          <p className="bk-ref-title">Booking Reference</p>
                          <p className="bk-ref-code">{bk.ref}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="no-results">
              <span style={{ fontSize:48 }}>📋</span>
              <p>No {tab.toLowerCase()} bookings yet</p>
              <button onClick={() => setShowAdd(true)}>Add a booking</button>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <Modal title="Add Booking 📋" onClose={() => setShowAdd(false)}>
          <BookingForm onSave={handleAdd} onClose={() => setShowAdd(false)} />
        </Modal>
      )}

      {editBk && (
        <Modal title="Edit Booking ✏️" onClose={() => setEditBk(null)}>
          <BookingForm initial={editBk} onSave={handleEdit} onClose={() => setEditBk(null)} />
        </Modal>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <span style={{ fontSize:36 }}>🗑️</span>
            <h3>Cancel this booking?</h3>
            <p>This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="tf-btn-cancel" onClick={() => setDeleteId(null)}>Keep It</button>
              <button className="tf-btn-danger" onClick={() => handleDelete(deleteId)}>Cancel Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
