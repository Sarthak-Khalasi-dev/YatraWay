import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useToast } from '../context/ToastContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { PlaneIcon, HotelIcon, ShieldIcon, WaveIcon, MountainIcon, CompassIcon } from '../components/icons/LuxuryIcons'
import './Bookings.css'

const INITIAL_BOOKINGS = [
  {
    id: 'bk-bali-flight',
    type: 'Flight',
    title: 'Flight MH-842',
    subtitle: 'Kuala Lumpur (KUL) → Denpasar Bali (DPS)',
    dates: '24 Oct 2024',
    time: '02:45 PM (Arrival)',
    terminal: 'Terminal 3 • Gate B12',
    status: 'Confirmed',
    isCompleted: false,
    price: '₹38,500',
    ref: 'MH-842-DPS',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&q=85&auto=format&fit=crop',
    icon: '✈️',
  },
  {
    id: 'bk-mandapa-resort',
    type: 'Stay',
    title: 'Mandapa, Ritz-Carlton Reserve',
    subtitle: 'Riverfront Pool Villa • Ubud, Gianyar, Bali',
    dates: '24 Oct — 30 Oct 2024 (6 Nights)',
    time: 'Check-in 03:00 PM',
    terminal: '★ LUXURY RESIDENCE',
    status: 'Confirmed',
    isCompleted: false,
    price: '₹1,62,000',
    ref: 'MNDP-7749-BALI',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&q=85&auto=format&fit=crop',
    icon: '🏨',
  },
  {
    id: 'bk-insurance',
    type: 'Insurance',
    title: 'NomadCare Platinum Global Cover',
    subtitle: 'Comprehensive Medical & Trip Cancellation Coverage',
    dates: '24 Oct — 05 Nov 2024',
    time: '24/7 Global SOS Support',
    terminal: 'Policy #NC-789210-BL',
    status: 'Confirmed',
    isCompleted: false,
    price: '₹7,200',
    ref: 'NC-789210-BL',
    img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&q=85&auto=format&fit=crop',
    icon: '🛡️',
  },
  {
    id: 'bk-taj-agra',
    type: 'Stay',
    title: 'The Oberoi Amarvilas, Agra',
    subtitle: 'Premier Taj Mahal View Suite • Uttar Pradesh, India',
    dates: '12 Oct — 16 Oct 2024 (Completed)',
    time: 'Completed Journey',
    terminal: '★ PALACE HERITAGE',
    status: 'Completed',
    isCompleted: true,
    price: '₹95,000',
    ref: 'OBR-AGR-4410',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&q=85&auto=format&fit=crop',
    icon: '🏨',
  },
  {
    id: 'bk-capri-yacht',
    type: 'Activity',
    title: 'Capri & Amalfi Coast Private Yacht',
    subtitle: 'Riva Dolceriva Sunset Charter • Blue Grotto & Faraglioni',
    dates: '15 Aug — 18 Aug 2024 (Completed)',
    time: 'Completed Journey',
    terminal: 'PRIVATE SKIPPER & SOMMELIER',
    status: 'Completed',
    isCompleted: true,
    price: '₹1,20,000',
    ref: 'RIVA-CAP-892',
    img: 'https://images.unsplash.com/photo-1533104182429-4b31e8ae3e9e?w=600&h=400&q=85&auto=format&fit=crop',
    icon: '⛵',
  },
  {
    id: 'bk-swiss-chalet',
    type: 'Stay',
    title: 'The Omnia Alpine Luxury Lodge, Zermatt',
    subtitle: 'Matterhorn Panorama Chalet • Valais, Switzerland',
    dates: '05 July — 12 July 2024 (Completed)',
    time: 'Completed Journey',
    terminal: '★ ALPINE WELLNESS',
    status: 'Completed',
    isCompleted: true,
    price: '₹2,80,000',
    ref: 'OMN-ZMT-102',
    img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&h=400&q=85&auto=format&fit=crop',
    icon: '🏔️',
  },
]

export default function Bookings() {
  const navigate = useNavigate()
  const toast = useToast()
  usePageTitle('Travel Bookings & Logistics — Wanderlust')

  const [bookings, setBookings] = useState(INITIAL_BOOKINGS)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // New Booking State
  const [newTitle, setNewTitle] = useState('')
  const [newSubtitle, setNewSubtitle] = useState('')
  const [newType, setNewType] = useState('Stay')
  const [newDates, setNewDates] = useState('')
  const [newPrice, setNewPrice] = useState('₹45,000')

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        item.ref.toLowerCase().includes(search.toLowerCase())

      let matchesTab = true
      if (activeTab === 'Upcoming') matchesTab = !item.isCompleted
      else if (activeTab === 'Completed') matchesTab = item.isCompleted
      else if (activeTab === 'Flights') matchesTab = item.type === 'Flight'
      else if (activeTab === 'Stays') matchesTab = item.type === 'Stay'

      return matchesSearch && matchesTab
    })
  }, [bookings, search, activeTab])

  const handleCreateBooking = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newBookingObj = {
      id: `bk-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      subtitle: newSubtitle || 'Confirmed travel reservation',
      dates: newDates || 'Nov 20 — Nov 27 2024',
      time: 'Confirmed Booking',
      terminal: '★ CONFIRMED RESERVATION',
      status: 'Confirmed',
      isCompleted: false,
      price: newPrice || '₹50,000',
      ref: `YTR-${Math.floor(1000 + Math.random() * 9000)}`,
      img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&q=85&auto=format&fit=crop',
      icon: newType === 'Flight' ? '✈️' : newType === 'Stay' ? '🏨' : '🎯',
    }

    setBookings((prev) => [newBookingObj, ...prev])
    setShowAddModal(false)
    setNewTitle('')
    setNewSubtitle('')
    toast.success(`🎉 Booking for ${newBookingObj.title} added!`)
  }

  return (
    <div className="bk-page-root">
      <Sidebar />

      <main className="bk-main-content">
        <div className="bk-scroll-container">
          {/* ── 1. TOP HEADER & METRICS ── */}
          <header className="bk-top-header">
            <div className="bk-title-group">
              <h1 className="bk-hero-title">Travel Bookings & Logistics</h1>
              <p className="bk-hero-sub">
                Manage confirmed flight boarding passes, luxury villas, transport logistics, and past journey receipts.
              </p>
            </div>

            <div className="bk-header-actions">
              <button className="bk-add-btn" onClick={() => setShowAddModal(true)}>
                <span>+ Add Booking</span>
              </button>
            </div>
          </header>

          {/* ── 2. LOGISTICS BANNER (Matching Image 1) ── */}
          <section className="bk-hero-logistics-banner">
            <div className="bhl-left-info">
              <span className="bhl-tag">UPCOMING IMMERSION • 12 DAYS TO GO</span>
              <h2 className="bhl-title">Bali Itinerary & Logistics</h2>
              <p className="bhl-desc">
                Your spiritual journey through the heart of Ubud begins with seamless flight coordination and private Mandapa Reserve sanctuary check-in.
              </p>
              
              <div className="bhl-actions">
                <button
                  className="bhl-btn-primary"
                  onClick={() => toast.success('Digital Travel Vouchers downloaded!')}
                >
                  <span>Download Vouchers</span>
                  <span>→</span>
                </button>
                <button
                  className="bhl-btn-secondary"
                  onClick={() => navigate('/messages')}
                >
                  <CompassIcon size={14} color="currentColor" />
                  <span>Travel Concierge</span>
                </button>
              </div>
            </div>

            <div className="bhl-right-quick-pills">
              <div className="bhl-quick-card">
                <div className="bqc-icon-box dark">
                  <PlaneIcon size={16} color="#FFFFFF" />
                </div>
                <div>
                  <span className="bqc-label">FLIGHT MH-842</span>
                  <p className="bqc-val">Arr: 02:45 PM • Terminal 3</p>
                </div>
              </div>

              <div className="bhl-quick-card">
                <div className="bqc-icon-box gold">
                  <HotelIcon size={16} color="#D4A843" />
                </div>
                <div>
                  <span className="bqc-label">MANDAPA RESERVE</span>
                  <p className="bqc-val">Ubud, Bali • Check-in 03:00 PM</p>
                </div>
              </div>

              <div className="bhl-quick-card">
                <div className="bqc-icon-box blue">
                  <ShieldIcon size={16} color="#60A5FA" />
                </div>
                <div>
                  <span className="bqc-label">NOMADCARE ACTIVE</span>
                  <p className="bqc-val">Policy #NC-789210-BL</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3. SEARCH & TABS FILTER BAR ── */}
          <div className="bk-filter-bar">
            <div className="bk-tabs-group">
              {['All', 'Upcoming', 'Stays', 'Flights', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  className={`bk-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bk-search-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8C867A" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search bookings or ref #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bk-search-input"
              />
            </div>
          </div>

          {/* ── 4. BOOKINGS CARDS GRID ── */}
          <div className="bk-grid-layout">
            {filteredBookings.map((b) => (
              <div key={b.id} className="bk-editorial-card">
                <div className="bk-card-media">
                  <img src={b.img} alt={b.title} className="bk-media-img" />
                  <div className="bk-status-chip">
                    <span className={`bk-dot ${b.isCompleted ? 'completed' : 'confirmed'}`} />
                    <span>{b.status}</span>
                  </div>
                  <span className="bk-type-badge">{b.type}</span>
                </div>

                <div className="bk-card-content">
                  <div className="bk-card-top-info">
                    <span className="bk-card-ref">REF: {b.ref}</span>
                    <span className="bk-card-terminal">{b.terminal}</span>
                  </div>

                  <h3 className="bk-card-title">{b.title}</h3>
                  <p className="bk-card-sub">{b.subtitle}</p>

                  <div className="bk-card-details-box">
                    <div className="bk-detail-item">
                      <span className="bdi-lbl">DATES & TIMING</span>
                      <span className="bdi-val">{b.dates} • {b.time}</span>
                    </div>
                  </div>

                  <div className="bk-card-footer">
                    <div className="bk-price-column">
                      <span className="bpc-lbl">TOTAL AMOUNT</span>
                      <span className="bpc-val">{b.price}</span>
                    </div>

                    <button
                      className="bk-action-btn"
                      onClick={() => {
                        toast.success(`📄 Accessing voucher for ${b.title}...`)
                        setSelectedBookingForModal(b)
                      }}
                    >
                      <span>View Voucher</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. VOUCHER MODAL ── */}
        {selectedBookingForModal && (
          <div className="bk-modal-backdrop" onClick={() => setSelectedBookingForModal(null)}>
            <div className="bk-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="bk-modal-hdr">
                <div>
                  <span className="modal-ref-tag">CONFIRMED VOUCHER • {selectedBookingForModal.ref}</span>
                  <h3 className="modal-title">{selectedBookingForModal.title}</h3>
                </div>
                <button className="modal-close" onClick={() => setSelectedBookingForModal(null)}>
                  ✕
                </button>
              </div>

              <div className="bk-voucher-body">
                <img
                  src={selectedBookingForModal.img}
                  alt={selectedBookingForModal.title}
                  className="voucher-img"
                />

                <div className="voucher-fields-grid">
                  <div className="v-field">
                    <span className="vf-lbl">GUEST / PASSENGER</span>
                    <span className="vf-val">Elena Rodriguez / Wanderlust Member</span>
                  </div>
                  <div className="v-field">
                    <span className="vf-lbl">STATUS</span>
                    <span className="vf-val text-green">{selectedBookingForModal.status}</span>
                  </div>
                  <div className="v-field">
                    <span className="vf-lbl">DATES</span>
                    <span className="vf-val">{selectedBookingForModal.dates}</span>
                  </div>
                  <div className="v-field">
                    <span className="vf-lbl">LOCATION / DETAILS</span>
                    <span className="vf-val">{selectedBookingForModal.subtitle}</span>
                  </div>
                  <div className="v-field">
                    <span className="vf-lbl">AMOUNT PAID</span>
                    <span className="vf-val">{selectedBookingForModal.price}</span>
                  </div>
                  <div className="v-field">
                    <span className="vf-lbl">ISSUED BY</span>
                    <span className="vf-val">Wanderlust Concierge Services Ltd.</span>
                  </div>
                </div>

                <div className="voucher-modal-actions">
                  <button
                    className="v-btn-primary"
                    onClick={() => {
                      toast.success('📥 Official PDF Voucher saved to downloads!')
                      setSelectedBookingForModal(null)
                    }}
                  >
                    <span>Download PDF Voucher</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 6. ADD BOOKING MODAL ── */}
        {showAddModal && (
          <div className="bk-modal-backdrop" onClick={() => setShowAddModal(false)}>
            <div className="bk-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="bk-modal-hdr">
                <h3 className="modal-title">Add Reservation / Booking</h3>
                <button className="modal-close" onClick={() => setShowAddModal(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateBooking} className="bk-modal-form">
                <div className="bm-field">
                  <label>Title (Hotel, Flight or Experience) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alila Ubud Luxury Resort"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div className="bm-field">
                  <label>Location / Details</label>
                  <input
                    type="text"
                    placeholder="e.g. Deluxe Terrace Pool Villa, Bali"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                  />
                </div>

                <div className="bm-grid-2">
                  <div className="bm-field">
                    <label>Category</label>
                    <select value={newType} onChange={(e) => setNewType(e.target.value)}>
                      <option value="Stay">Luxury Stay</option>
                      <option value="Flight">Flight / Charter</option>
                      <option value="Activity">Experience / Activity</option>
                      <option value="Insurance">Travel Insurance</option>
                    </select>
                  </div>

                  <div className="bm-field">
                    <label>Amount (Price)</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹55,000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bm-field">
                  <label>Dates</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Nov — 22 Nov 2024"
                    value={newDates}
                    onChange={(e) => setNewDates(e.target.value)}
                  />
                </div>

                <div className="bm-actions">
                  <button
                    type="button"
                    className="bm-btn-cancel"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bm-btn-submit">
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
