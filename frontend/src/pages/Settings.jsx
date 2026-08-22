import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useTheme } from '../context/ThemeContext'
import './Settings.css'

const SECTIONS = ['Profile', 'Notifications', 'Privacy', 'Payments', 'Preferences', 'About']

export default function Settings() {
  const [mounted, setMounted] = useState(false)
  const [section, setSection] = useState('Profile')
  const { dark, toggle } = useTheme()
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({ name:'Ananya Sharma', email:'ananya@example.com', phone:'+91 98765 43210', bio:'Adventure seeker · 24 countries · Coffee lover ☕', city:'Bangalore', country:'India' })
  const [notifPrefs, setNotifPrefs] = useState({ bookingUpdates:true, priceAlerts:true, tripReminders:true, newsletters:false, smsAlerts:false, pushNotif:true })
  const [privacy, setPrivacy] = useState({ profilePublic:true, showTrips:true, showReviews:true, dataSharing:false })
  const [prefs, setPrefs] = useState({ currency:'INR', language:'English', units:'Metric', seatPref:'Window', mealPref:'Vegetarian' })

  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t) }, [])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const Toggle = ({ checked, onChange }) => (
    <button className={`settings-toggle ${checked ? 'settings-toggle--on' : ''}`} onClick={onChange}>
      <span className="settings-toggle-thumb" />
    </button>
  )

  return (
    <div className={`page-shell ${mounted ? 'mounted' : ''}`}>
      <Sidebar />
      <div className="page-body">
        <Topbar title="Settings" subtitle="Manage your account preferences" />
        <div className="settings-layout">

          {/* Section nav */}
          <nav className="settings-nav">
            {SECTIONS.map(s => (
              <button key={s} className={`settings-nav-item ${section===s?'settings-nav-item--active':''}`} onClick={() => setSection(s)}>
                <span>{s==='Profile'?'👤':s==='Notifications'?'🔔':s==='Privacy'?'🔒':s==='Payments'?'💳':s==='Preferences'?'⚙️':'ℹ️'}</span>
                {s}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="settings-content">
            {section === 'Profile' && (
              <div className="settings-section" key="profile">
                <div className="settings-group">
                  <h2 className="settings-group-title">Profile Information</h2>
                  {/* Avatar */}
                  <div className="settings-avatar-row">
                    <img src="https://picsum.photos/seed/portrait/160/160" className="settings-avatar" alt="User" />
                    <div>
                      <p className="settings-avatar-name">Ananya Sharma</p>
                      <p className="settings-avatar-role">🌍 Explorer · Member since 2022</p>
                      <button className="btn btn-outline" style={{ marginTop:10, fontSize:12.5 }}>Change Photo</button>
                    </div>
                  </div>
                  <div className="settings-grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" value={profile.name} onChange={e => setProfile(p=>({...p,name:e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input className="form-input" type="email" value={profile.email} onChange={e => setProfile(p=>({...p,email:e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input className="form-input" value={profile.phone} onChange={e => setProfile(p=>({...p,phone:e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className="form-input" value={profile.city} onChange={e => setProfile(p=>({...p,city:e.target.value}))} />
                    </div>
                    <div className="form-group" style={{ gridColumn:'1/-1' }}>
                      <label className="form-label">Bio</label>
                      <textarea className="form-input settings-textarea" value={profile.bio} onChange={e => setProfile(p=>({...p,bio:e.target.value}))} rows={3} />
                    </div>
                  </div>
                </div>

                <div className="settings-group">
                  <h2 className="settings-group-title">Security</h2>
                  <div className="settings-list">
                    {[
                      { label:'Change Password', sub:'Last changed 3 months ago', icon:'🔑' },
                      { label:'Two-Factor Authentication', sub:'Add extra security to your account', icon:'🛡️' },
                      { label:'Active Sessions', sub:'2 devices logged in', icon:'💻' },
                    ].map(item => (
                      <div key={item.label} className="settings-list-item">
                        <span className="settings-list-icon">{item.icon}</span>
                        <div>
                          <p className="settings-list-label">{item.label}</p>
                          <p className="settings-list-sub">{item.sub}</p>
                        </div>
                        <button className="btn btn-outline" style={{ fontSize:12, padding:'6px 14px' }}>Manage</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {section === 'Notifications' && (
              <div className="settings-section" key="notifs">
                <div className="settings-group">
                  <h2 className="settings-group-title">Notification Preferences</h2>
                  <div className="settings-list">
                    {[
                      { key:'bookingUpdates', label:'Booking Updates',  sub:'Confirmations, reminders, changes', icon:'✈️' },
                      { key:'priceAlerts',    label:'Price Drop Alerts', sub:'Get notified when prices drop',    icon:'💰' },
                      { key:'tripReminders',  label:'Trip Reminders',    sub:'24h and 1h before your trips',     icon:'⏰' },
                      { key:'pushNotif',      label:'Push Notifications', sub:'Alerts on your device',           icon:'📱' },
                      { key:'newsletters',    label:'Newsletter',        sub:'Weekly travel inspiration',        icon:'📧' },
                      { key:'smsAlerts',      label:'SMS Alerts',        sub:'Text messages for urgent updates', icon:'💬' },
                    ].map(item => (
                      <div key={item.key} className="settings-list-item">
                        <span className="settings-list-icon">{item.icon}</span>
                        <div>
                          <p className="settings-list-label">{item.label}</p>
                          <p className="settings-list-sub">{item.sub}</p>
                        </div>
                        <Toggle checked={notifPrefs[item.key]} onChange={() => setNotifPrefs(p=>({...p,[item.key]:!p[item.key]}))} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {section === 'Privacy' && (
              <div className="settings-section" key="privacy">
                <div className="settings-group">
                  <h2 className="settings-group-title">Privacy Settings</h2>
                  <div className="settings-list">
                    {[
                      { key:'profilePublic', label:'Public Profile',    sub:'Others can view your profile', icon:'👁️' },
                      { key:'showTrips',     label:'Show My Trips',     sub:'Display past trips on profile', icon:'🗺️' },
                      { key:'showReviews',   label:'Show My Reviews',   sub:'Show reviews you\'ve written',  icon:'⭐' },
                      { key:'dataSharing',   label:'Analytics Sharing', sub:'Share usage data to improve app', icon:'📊' },
                    ].map(item => (
                      <div key={item.key} className="settings-list-item">
                        <span className="settings-list-icon">{item.icon}</span>
                        <div>
                          <p className="settings-list-label">{item.label}</p>
                          <p className="settings-list-sub">{item.sub}</p>
                        </div>
                        <Toggle checked={privacy[item.key]} onChange={() => setPrivacy(p=>({...p,[item.key]:!p[item.key]}))} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="settings-group">
                  <h2 className="settings-group-title">Data & Account</h2>
                  <div className="settings-list">
                    <div className="settings-list-item">
                      <span className="settings-list-icon">📦</span>
                      <div><p className="settings-list-label">Export My Data</p><p className="settings-list-sub">Download all your travel data</p></div>
                      <button className="btn btn-outline" style={{ fontSize:12, padding:'6px 14px' }}>Export</button>
                    </div>
                    <div className="settings-list-item">
                      <span className="settings-list-icon">🗑️</span>
                      <div><p className="settings-list-label" style={{ color:'var(--red)' }}>Delete Account</p><p className="settings-list-sub">Permanently remove your account</p></div>
                      <button className="btn btn-danger" style={{ fontSize:12, padding:'6px 14px' }}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {section === 'Payments' && (
              <div className="settings-section" key="payments">
                <div className="settings-group">
                  <h2 className="settings-group-title">Payment Methods</h2>
                  {[
                    { type:'Visa', last:'4242', exp:'12/26', icon:'💳', primary:true },
                    { type:'UPI',  last:'ananya@upi', exp:'Active', icon:'📱', primary:false },
                  ].map(card => (
                    <div key={card.last} className="settings-payment-card">
                      <span style={{ fontSize:24 }}>{card.icon}</span>
                      <div>
                        <p className="settings-list-label">{card.type} {card.type==='Visa'?`ending in ${card.last}`:card.last}</p>
                        <p className="settings-list-sub">Expires {card.exp} {card.primary && '· Primary'}</p>
                      </div>
                      <div className="settings-payment-actions">
                        {card.primary && <span className="badge" style={{ background:'var(--green-bg)', color:'var(--green)' }}>Primary</span>}
                        <button className="btn btn-outline" style={{ fontSize:12, padding:'6px 14px' }}>Remove</button>
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-primary" style={{ marginTop:8, alignSelf:'flex-start' }}>+ Add Payment Method</button>
                </div>
              </div>
            )}

            {section === 'Preferences' && (
              <div className="settings-section" key="prefs">
                <div className="settings-group">
                  <h2 className="settings-group-title">App Preferences</h2>
                  <div className="settings-list-item" style={{ padding:'12px 0' }}>
                    <span className="settings-list-icon">{dark?'🌙':'☀️'}</span>
                    <div><p className="settings-list-label">Dark Mode</p><p className="settings-list-sub">Toggle between light and dark theme</p></div>
                    <Toggle checked={dark} onChange={toggle} />
                  </div>
                  <div className="settings-grid-2" style={{ marginTop:12 }}>
                    {[
                      { label:'Currency', key:'currency', options:['INR','USD','EUR','GBP','AED'] },
                      { label:'Language', key:'language', options:['English','Hindi','Spanish','French'] },
                      { label:'Units',    key:'units',    options:['Metric','Imperial'] },
                      { label:'Preferred Seat', key:'seatPref', options:['Window','Aisle','Middle'] },
                      { label:'Meal Preference', key:'mealPref', options:['Vegetarian','Vegan','Non-Veg','Halal','Jain'] },
                    ].map(item => (
                      <div key={item.key} className="form-group">
                        <label className="form-label">{item.label}</label>
                        <select className="form-input" value={prefs[item.key]} onChange={e => setPrefs(p=>({...p,[item.key]:e.target.value}))}>
                          {item.options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {section === 'About' && (
              <div className="settings-section" key="about">
                <div className="settings-group" style={{ textAlign:'center', padding:'32px 0' }}>
                  <div className="sb-logo-mark" style={{ width:56, height:56, borderRadius:16, margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,var(--charcoal),var(--charcoal-2))' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 18 12 2 21 18"/><path d="M9 18 12 12 15 18"/></svg>
                  </div>
                  <h2 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:700, color:'var(--text-1)', marginBottom:4 }}>NomadNest</h2>
                  <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:6 }}>Version 2.0.0 · Built with ❤️</p>
                  <p style={{ color:'var(--text-3)', fontSize:13 }}>Your ultimate travel companion</p>
                  <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:24, flexWrap:'wrap' }}>
                    {['Privacy Policy','Terms of Service','Help & Support','Rate Us'].map(l => (
                      <button key={l} className="btn btn-outline" style={{ fontSize:12.5 }}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save bar */}
            {['Profile','Notifications','Privacy','Preferences'].includes(section) && (
              <div className="settings-save-bar">
                <button className="btn btn-outline">Discard Changes</button>
                <button className={`btn btn-primary ${saved ? 'btn-saved' : ''}`} onClick={handleSave}>
                  {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
