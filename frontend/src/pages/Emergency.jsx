import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import L from 'leaflet'
import {
  ShieldAlert, Phone, MessageSquare, Plus, Hospital,
  MapPin, User, AlertTriangle, Trash2, Edit2, Check, X
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { fetchContacts, addContact, removeContact } from '../store/slices/emergencySlice'
import { useToast } from '../context/ToastContext'
import './Emergency.css'

const HOSPITALS = [
  { id: 1, name: 'City Central Hospital',  dist: '0.8 km', phone: '+91 80 1234 5678', pos: [12.9716, 77.5946] },
  { id: 2, name: "St. Mary's Emergency",   dist: '1.2 km', phone: '+91 80 8765 4321', pos: [12.9750, 77.6000] },
  { id: 3, name: 'Apollo Specialist Care', dist: '2.5 km', phone: '+91 80 1122 3344', pos: [12.9650, 77.5850] },
]

function ContactModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name:'', relation:'', phone:'' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth:420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <h3 className="modal-title">{initial ? 'Edit Contact ✏️' : 'Add Emergency Contact 📞'}</h3>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <form className="trip-form" onSubmit={handleSubmit}>
          <div className="tf-grid" style={{ gridTemplateColumns:'1fr' }}>
            <div className="tf-field"><label>Full Name *</label><input required placeholder="Rajesh Sharma" value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div className="tf-field"><label>Relationship *</label><input required placeholder="Father, Partner, Friend..." value={form.relation} onChange={e => set('relation', e.target.value)} /></div>
            <div className="tf-field"><label>Phone Number *</label><input required type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
          </div>
          <div className="tf-actions">
            <button type="button" className="tf-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="tf-btn-save"><Check size={14} /> {initial ? 'Save Changes' : 'Add Contact'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Emergency() {
  const [mounted, setMounted]         = useState(false)
  const [userPos, setUserPos]         = useState([12.9716, 77.5946])
  const [isSOSActive, setIsSOSActive] = useState(false)
  const [alertMsg, setAlertMsg]       = useState(null)
  const [holdProgress, setHoldProgress] = useState(0)
  const [isHolding, setIsHolding]     = useState(false)
  const [showAdd, setShowAdd]         = useState(false)
  const [deleteId, setDeleteId]       = useState(null)
  const [hospSearch, setHospSearch]   = useState('')

  const mapRef      = useRef(null)
  const mapInstance = useRef(null)
  
  const dispatch = useDispatch()
  const { contacts, loading } = useSelector((state) => state.emergency)
  const toast = useToast()

  useEffect(() => {
    setMounted(true)
    dispatch(fetchContacts())
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(pos => { setUserPos([pos.coords.latitude, pos.coords.longitude]) })
    }
  }, [dispatch])

  useEffect(() => {
    if (!mounted || !mapRef.current) return
    if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
    const map = L.map(mapRef.current, { zoomControl: true }).setView(userPos, 15)
    mapInstance.current = map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map)
    const userIcon = L.divIcon({ className: 'custom-marker', html: '<div class="marker-pulse"></div><div class="marker-dot"></div>', iconSize: [30, 30], iconAnchor: [15, 15] })
    L.marker(userPos, { icon: userIcon }).addTo(map).bindPopup('You are here')
    const hospitalIcon = L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] })
    HOSPITALS.forEach(h => { L.marker(h.pos, { icon: hospitalIcon }).addTo(map).bindPopup(`<div class="popup-content"><strong>${h.name}</strong><br/>${h.dist} away<br/><button class="popup-call-btn" onclick="window.location.href='tel:${h.phone}'">Call Now</button></div>`) })
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } }
  }, [mounted, userPos])

  useEffect(() => {
    let timer
    if (isHolding && !isSOSActive) {
      timer = setInterval(() => { setHoldProgress(p => { if (p >= 100) { triggerSOS(); return 0; } return p + 2; }) }, 50)
    } else { setHoldProgress(0); clearInterval(timer); }
    return () => clearInterval(timer)
  }, [isHolding, isSOSActive])

  const triggerSOS = () => {
    setIsSOSActive(true); setIsHolding(false)
    const phones = contacts.map(c => c.phone).join(', ') || 'emergency contacts'
    setAlertMsg(`🚨 SOS Signal Sent! Notified: ${phones}. Local authorities alerted.`)
    setTimeout(() => { setAlertMsg(null); setIsSOSActive(false) }, 6000)
    toast.error('SOS Alert Sent!')
  }

  const handleCall = (num) => { window.location.href = `tel:${num}` }
  const handleMessage = (num) => {
    const msg = `URGENT: I need help. My location: https://www.google.com/maps?q=${userPos[0]},${userPos[1]}`
    window.location.href = `sms:${num}?body=${encodeURIComponent(msg)}`
  }

  const handleAddContact = async (c) => {
    const result = await dispatch(addContact(c))
    if (addContact.fulfilled.match(result)) toast.success('Contact added! 📞')
  }

  const handleDeleteContact = async (id) => {
    const result = await dispatch(removeContact(id))
    if (removeContact.fulfilled.match(result)) { setDeleteId(null); toast.info('Contact removed'); }
  }

  const filteredHospitals = HOSPITALS.filter(h => h.name.toLowerCase().includes(hospSearch.toLowerCase()))

  return (
    <div className={`page-shell ${mounted ? 'mounted' : ''}`}>
      <Sidebar />
      <main className="page-body">
        <header className="page-header">
          <div className="page-header-left"><h1>Emergency Center</h1><p>Instant help and safety resources for your journey</p></div>
          <div className="flex gap-12"><button className="btn btn-outline" onClick={() => handleCall('112')}><Phone size={16} /> 112 Emergency</button></div>
        </header>

        <div className="page-scroll">
          <div className="em-container">
            <section className="sos-hero">
              <div className="sos-hero-info">
                <h2 className="sos-title">Emergency SOS</h2>
                <p className="sos-subtitle">Press and hold the button for 3 seconds to trigger an emergency alert. Your emergency contacts and local authorities will be notified with your live location.</p>
                {alertMsg && <div className="sos-alert-msg animate-fadeUp"><AlertTriangle size={20} /><span>{alertMsg}</span></div>}
              </div>
              <div className="sos-btn-wrap">
                <svg className="sos-progress-svg" viewBox="0 0 100 100"><circle className="sos-progress-bg" cx="50" cy="50" r="45" /><circle className="sos-progress-fill" cx="50" cy="50" r="45" style={{ strokeDasharray: 283, strokeDashoffset: 283 - (283 * holdProgress) / 100 }} /></svg>
                <div className={`sos-pulse-ring ${isHolding ? 'sos-pulse--fast' : ''}`} /><div className={`sos-pulse-ring sos-pulse-ring-2 ${isHolding ? 'sos-pulse--fast' : ''}`} />
                <button className={`sos-btn ${isSOSActive ? 'sos-btn--active' : ''} ${isHolding ? 'sos-btn--holding' : ''}`} onMouseDown={() => setIsHolding(true)} onMouseUp={() => setIsHolding(false)} onMouseLeave={() => setIsHolding(false)} onTouchStart={(e) => { e.preventDefault(); setIsHolding(true) }} onTouchEnd={() => setIsHolding(false)}>
                  <ShieldAlert size={48} className="sos-btn-ico" /><span className="sos-btn-txt">{isSOSActive ? 'SENT' : 'SOS'}</span>
                </button>
              </div>
            </section>

            <div className="em-grid">
              <div className="card map-card"><div className="map-header"><div className="flex items-center gap-3"><MapPin className="text-blue" size={20} /><span className="sec-title">Live Location</span></div><span className="badge bg-blue-bg text-blue">Live Tracking Active</span></div><div className="map-container-wrap"><div ref={mapRef} className="full-map" /></div></div>
              <div className="flex-col gap-24">
                <div className="card dial-card"><div className="p-5 border-b border-border"><span className="sec-title">Quick Dial Services</span></div><div className="dial-grid">{[{ lbl:'Police', num:'100', ico:'👮', color:'blue' },{ lbl:'Ambulance', num:'102', ico:'🚑', color:'red' },{ lbl:'Fire', num:'101', ico:'🔥', color:'amber' },{ lbl:'Women Help', num:'1091', ico:'🛡️', color:'purple' }].map(s => (<button key={s.num} className={`dial-btn dial-btn--${s.color}`} onClick={() => handleCall(s.num)}><span className="dial-ico">{s.ico}</span><div className="dial-info"><span className="dial-num">{s.num}</span><span className="dial-lbl">{s.lbl}</span></div></button>)) }</div></div>
                <div className="card"><div className="p-5 border-b border-border flex items-center justify-between"><div className="flex items-center gap-3"><Hospital className="text-red" size={20} /><span className="sec-title">Nearby Hospitals</span></div></div><div className="hosp-search-wrap"><input className="hosp-search-inp" placeholder="Search facilities..." value={hospSearch} onChange={e => setHospSearch(e.target.value)} /></div><div className="hosp-list">{filteredHospitals.map(h => (<div className="hosp-item" key={h.id}><div className="hosp-info"><div className="hosp-ico"><Hospital size={18} /></div><div><p className="hosp-name">{h.name}</p><p className="hosp-dist">{h.dist} away · <span className="text-green">Open 24/7</span></p></div></div><button className="btn btn-ghost p-2" onClick={() => handleCall(h.phone)}><Phone size={18} /></button></div>))}{filteredHospitals.length === 0 && <p style={{ textAlign:'center', padding:'16px', color:'var(--text-3)', fontSize:13 }}>No hospitals found</p>}</div></div>
                <div className="card contacts-card"><div className="contacts-header"><div className="flex items-center gap-3"><User className="text-gold" size={20} /><span className="sec-title">Emergency Contacts ({contacts.length})</span></div><button className="btn btn-ghost p-1" onClick={() => setShowAdd(true)}><Plus size={18} /></button></div><div className="contacts-list">{contacts.length === 0 && !loading && (<div style={{ textAlign:'center', padding:'20px 16px', color:'var(--text-3)', fontSize:13 }}><p>No contacts yet.</p><button onClick={() => setShowAdd(true)} style={{ marginTop:8, color:'var(--gold)', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>+ Add first contact</button></div>)}{contacts.map(c => (<div className="contact-item" key={c._id}><div className="contact-avatar">{c.initial}</div><div className="contact-details"><p className="contact-name">{c.name}</p><p className="contact-rel">{c.relation} · {c.phone}</p></div><div className="flex gap-2"><button className="btn btn-ghost p-2 text-blue" onClick={() => handleMessage(c.phone)}><MessageSquare size={16} /></button><button className="btn btn-ghost p-2 text-green" onClick={() => handleCall(c.phone)}><Phone size={16} /></button><button className="btn btn-ghost p-2 text-red" onClick={() => setDeleteId(c._id)}><Trash2 size={14} /></button></div></div>))}</div></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showAdd && <ContactModal onSave={handleAddContact} onClose={() => setShowAdd(false)} />}
      {deleteId && (<div className="modal-overlay" onClick={() => setDeleteId(null)}><div className="confirm-box" onClick={e => e.stopPropagation()}><span style={{ fontSize:36 }}>🗑️</span><h3>Remove contact?</h3><p>They won't receive SOS alerts.</p><div className="confirm-actions"><button className="tf-btn-cancel" onClick={() => setDeleteId(null)}>Keep</button><button className="tf-btn-danger" onClick={() => handleDeleteContact(deleteId)}>Remove</button></div></div></div>)}
    </div>
  )
}
