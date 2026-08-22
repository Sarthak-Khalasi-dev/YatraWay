import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { updateProfile } from '../store/slices/authSlice'
import { useToast } from '../context/ToastContext'
import api from '../services/api'
import './Profile.css'

const STATS = [
  { label:'Countries',    value:'24',  icon:'🌍', color:'#6366F1' },
  { label:'Trips Done',   value:'18',  icon:'✈️', color:'#10B981' },
  { label:'Days Traveled',value:'312', icon:'📅', color:'#F59E0B' },
  { label:'Reviews',      value:'43',  icon:'⭐', color:'#EF4444' },
  { label:'Photos',       value:'890', icon:'📸', color:'#8B5CF6' },
  { label:'Wishlist',     value:'12',  icon:'❤️', color:'#EC4899' },
]

const BADGES = [
  { icon:'🌏', label:'World Explorer',   desc:'Visited 20+ countries',   earned:true  },
  { icon:'🏔️', label:'Summit Seeker',    desc:'5 mountain destinations', earned:true  },
  { icon:'🍜', label:'Foodie Traveler',  desc:'Tried 50+ local cuisines', earned:true  },
  { icon:'📸', label:'Photography Pro',  desc:'500+ travel photos',       earned:true  },
  { icon:'✍️', label:'Top Reviewer',     desc:'40+ helpful reviews',      earned:true  },
  { icon:'🚀', label:'Solo Adventurer',  desc:'10 solo trips completed',  earned:false },
  { icon:'🌙', label:'Night Owl',        desc:'5 overnight journeys',     earned:false },
  { icon:'💎', label:'Luxury Nomad',     desc:'3 5-star stays',           earned:false },
]

const IMG = (seed, w = 600, h = 400) => `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=${w}&h=${h}&q=80&auto=format&fit=crop`

const TRIPS_DONE = [
  { dest:'Goa, India',       date:'Jan 2024',  days:7,  img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=200&h=200&q=80&auto=format&fit=crop', rating:5 },
  { dest:'Maldives',         date:'Mar 2024',  days:7,  img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=200&h=200&q=80&auto=format&fit=crop', rating:5 },
]

function StarRow({ count }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i<=count?'#F59E0B':'none'} stroke="#F59E0B" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

export default function Profile() {
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  
  const dispatch = useDispatch()
  const { userInfo, loading } = useSelector((state) => state.auth)
  const toast = useToast()

  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t) }, [])

  const formik = useFormik({
    initialValues: {
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      bio: userInfo?.bio || 'Adventure seeker obsessed with sunsets, street food, and stories from the road. 24 countries down, the whole world to go! 🌏',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      bio: Yup.string().max(200, 'Bio must be less than 200 characters'),
    }),
    onSubmit: async (values) => {
      const result = await dispatch(updateProfile(values))
      if (updateProfile.fulfilled.match(result)) {
        setEditing(false)
        toast.success('Profile updated! ✨')
      }
    },
  })

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    setUploading(true)
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      dispatch(updateProfile({ ...userInfo, avatar: data.image }))
      toast.success('Avatar updated! 📸')
    } catch (err) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`page-shell ${mounted ? 'mounted' : ''}`}>
      <Sidebar />
      <div className="page-body">
        <Topbar title="My Profile" subtitle="Your travel identity and journey so far" />
        <div className="page-scroll">

          <div className="profile-hero">
            <div className="profile-hero-bg">
              <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&h=500&q=80&auto=format&fit=crop" alt="Cover" className="profile-cover-img" />
              <div className="profile-cover-overlay" />
            </div>
            <div className="profile-hero-content">
              <div className="profile-avatar-wrap" onClick={() => fileInputRef.current?.click()} style={{ cursor:'pointer' }}>
                <img src={userInfo?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&q=80&auto=format&fit=crop'} className="profile-avatar" alt={userInfo?.name} />
                <div className="profile-avatar-badge">{uploading ? '⌛' : '📷'}</div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
              </div>
              <div className="profile-hero-info">
                <div className="profile-name-row"><h1 className="profile-name">{userInfo?.name}</h1><span className="profile-verified">✓ Verified</span></div>
                <p className="profile-tagline">✈️ Explorer · 📍 Bangalore, India · 🗓️ Member since 2022</p>
                <p className="profile-bio">{userInfo?.bio || 'Add a bio to tell people about your travels!'}</p>
              </div>
              <div className="profile-hero-actions">
                <button className={`btn ${editing ? 'btn-gold' : 'btn-primary'}`} onClick={() => { if(editing) formik.handleSubmit(); else setEditing(true); }}>
                  {editing ? '✓ Save Changes' : '✏️ Edit Profile'}
                </button>
                {editing && <button className="btn btn-outline" onClick={() => { setEditing(false); formik.resetForm(); }}>Cancel</button>}
              </div>
            </div>
          </div>

          <div className="profile-stats">
            {STATS.map((s, i) => (
              <div className="profile-stat-card" key={s.label} style={{ animationDelay:`${i*0.06}s` }}>
                <span className="profile-stat-icon" style={{ background:`${s.color}15`, color:s.color }}>{s.icon}</span>
                <p className="profile-stat-val">{s.value}</p><p className="profile-stat-lbl">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="profile-tabs">
            {['Overview', 'Trips', 'Reviews', 'Badges'].map(t => (
              <button key={t} className={`profile-tab ${tab===t.toLowerCase()?'profile-tab--active':''}`} onClick={() => setTab(t.toLowerCase())}>{t}</button>
            ))}
          </div>

          <div className="profile-tab-content">
            {tab === 'overview' && (
              <div className="profile-overview">
                <div className="card profile-card">
                  <h2 className="sec-title" style={{ marginBottom:14 }}>Profile Information</h2>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="profile-form-grid">
                      <div className="tf-field">
                        <label>Full Name</label>
                        <input name="name" disabled={!editing} {...formik.getFieldProps('name')} className={formik.touched.name && formik.errors.name ? 'error' : ''} />
                      </div>
                      <div className="tf-field">
                        <label>Email Address</label>
                        <input name="email" disabled={!editing} {...formik.getFieldProps('email')} className={formik.touched.email && formik.errors.email ? 'error' : ''} />
                      </div>
                      <div className="tf-field tf-full">
                        <label>Bio</label>
                        <textarea name="bio" disabled={!editing} rows={3} {...formik.getFieldProps('bio')} />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="card profile-card">
                  <h2 className="sec-title">Recent Trips</h2>
                  <div className="profile-trips-preview" style={{ marginTop:14 }}>
                    {TRIPS_DONE.map(t => (
                      <div key={t.dest} className="profile-trip-item"><img src={t.img} alt={t.dest} className="profile-trip-img" /><div><p className="profile-trip-dest">{t.dest}</p><p className="profile-trip-meta">{t.date} · {t.days} days</p><StarRow count={t.rating} /></div></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {tab === 'trips' && <div className="profile-trips-grid">{TRIPS_DONE.map((t, i) => (
              <div key={t.dest} className="card profile-trip-card" style={{ animationDelay:`${i*0.07}s` }}><img src={t.img} alt={t.dest} className="profile-trip-card-img" /><div className="profile-trip-card-info"><p className="profile-trip-dest">{t.dest}</p><p className="profile-trip-meta">{t.date} · {t.days} days</p><StarRow count={t.rating} /></div></div>
            ))}</div>}
            
            {tab === 'badges' && <div className="profile-badges-grid">{BADGES.map((b, i) => (
              <div key={b.label} className={`card profile-badge-card ${!b.earned ? 'profile-badge-card--locked' : ''}`} style={{ animationDelay:`${i*0.06}s` }}><span className="profile-badge-icon">{b.earned ? b.icon : '🔒'}</span><p className="profile-badge-label">{b.label}</p><p className="profile-badge-desc">{b.desc}</p></div>
            ))}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
