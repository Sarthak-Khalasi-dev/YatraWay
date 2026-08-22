import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { login, register, clearError } from '../store/slices/authSlice'
import { useToast } from '../context/ToastContext'
import { usePageTitle } from '../hooks/usePageTitle'
import './LoginPage.css'

/* ── Real travel photos ── */
const HERO_BG    = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80&auto=format&fit=crop'
const BALI_THUMB = 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=200&h=200&q=80&auto=format&fit=crop'

/* ── SVG icons ── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
}
function EyeIcon({ open }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  usePageTitle('Sign In')

  const { userInfo, loading, error } = useSelector((state) => state.auth)

  const [tab,       setTab]       = useState('signin')
  const [showPass,  setShowPass]  = useState(false)
  const [showConf,  setShowConf]  = useState(false)
  const [mounted,   setMounted]   = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    if (userInfo) navigate('/dashboard', { replace: true })
  }, [userInfo, navigate])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    ...(tab === 'signup' && {
      name: Yup.string().required('Required'),
      confirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    }),
  })

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirm: '' },
    validationSchema,
    onSubmit: async (values) => {
      if (tab === 'signin') {
        const result = await dispatch(login({ email: values.email, password: values.password }))
        if (login.fulfilled.match(result)) {
          toast.success('Welcome back! 👋')
        }
      } else {
        const result = await dispatch(register({ name: values.name, email: values.email, password: values.password }))
        if (register.fulfilled.match(result)) {
          toast.success('Account created! Welcome to NomadNest 🌍')
        }
      }
    },
  })

  const switchTab = (t) => {
    setTab(t)
    dispatch(clearError())
    formik.resetForm()
    setShowPass(false); setShowConf(false)
  }

  const fillDemo = () => {
    formik.setFieldValue('email', 'ananya@example.com')
    formik.setFieldValue('password', 'password123')
  }

  return (
    <div className={`login-root ${mounted ? 'mounted' : ''}`}>
      <div className="hero-panel">
        <img
          src={HERO_BG}
          alt="Beautiful travel destination"
          className={`hero-bg ${imgLoaded ? 'loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="hero-overlay" />
        <div className="logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 18 12 2 21 18"/><path d="M9 18 12 12 15 18"/>
            </svg>
          </div>
          <div className="logo-text"><span className="logo-name">NOMADNEST</span><span className="logo-sub">TRAVEL</span></div>
        </div>
        <div className="hero-content">
          <div className="hero-tag">✦ Premium Travel Experience</div>
          <h1 className="hero-title">Explore More.<br /><span className="hero-gold">Live More.</span></h1>
          <p className="hero-desc">Plan your dream journeys, discover hidden gems, and create unforgettable memories around the world.</p>
          <div className="hero-stats">
            <div className="h-stat"><span className="h-stat-num">50K+</span><span className="h-stat-lbl">Travelers</span></div>
            <div className="h-divider" /><div className="h-stat"><span className="h-stat-num">120+</span><span className="h-stat-lbl">Destinations</span></div>
            <div className="h-divider" /><div className="h-stat"><span className="h-stat-num">4.9★</span><span className="h-stat-lbl">Rating</span></div>
          </div>
        </div>
        <div className="lp-trip-card">
          <img src={BALI_THUMB} alt="Bali" className="lp-trip-thumb" />
          <div className="lp-trip-info"><p className="lp-trip-name">Next Trip: Bali, Indonesia</p><p className="lp-trip-dates">20 May — 02 June 2024 · 12 Days</p></div>
          <div className="lp-trip-badge">12 Days 🔥</div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div className="tabs">
            <button className={`tab-btn ${tab === 'signin' ? 'active' : ''}`} onClick={() => switchTab('signin')}>Sign In</button>
            <button className={`tab-btn ${tab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>Register</button>
          </div>

          <div className="auth-heading">
            <h2 className="auth-title">{tab === 'signin' ? 'Welcome back! 👋' : 'Join NomadNest 🌍'}</h2>
            <p className="auth-subtitle">{tab === 'signin' ? 'Sign in to continue your journey' : 'Create your free account today'}</p>
          </div>

          {tab === 'signin' && (
            <div className="demo-hint">
              <span className="demo-badge">DEMO</span><span>Try the app instantly — </span>
              <button type="button" onClick={fillDemo}>use demo account</button>
            </div>
          )}

          {error && (
            <div className="auth-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={formik.handleSubmit}>
            {tab === 'signup' && (
              <div className="field">
                <label className="field-label">Full Name</label>
                <div className="field-wrap">
                  <svg className="field-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" name="name" className={`field-input ${formik.touched.name && formik.errors.name ? 'error' : ''}`} placeholder="Ananya Sharma" {...formik.getFieldProps('name')} />
                </div>
                {formik.touched.name && formik.errors.name && <p className="field-error">{formik.errors.name}</p>}
              </div>
            )}

            <div className="field">
              <label className="field-label">Email Address</label>
              <div className="field-wrap">
                <svg className="field-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" name="email" className={`field-input ${formik.touched.email && formik.errors.email ? 'error' : ''}`} placeholder="you@example.com" {...formik.getFieldProps('email')} />
              </div>
              {formik.touched.email && formik.errors.email && <p className="field-error">{formik.errors.email}</p>}
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <svg className="field-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type={showPass ? 'text' : 'password'} name="password" className={`field-input ${formik.touched.password && formik.errors.password ? 'error' : ''}`} placeholder="••••••••" {...formik.getFieldProps('password')} />
                <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)} tabIndex={-1}><EyeIcon open={showPass} /></button>
              </div>
              {formik.touched.password && formik.errors.password && <p className="field-error">{formik.errors.password}</p>}
            </div>

            {tab === 'signup' && (
              <div className="field">
                <label className="field-label">Confirm Password</label>
                <div className="field-wrap">
                  <svg className="field-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type={showConf ? 'text' : 'password'} name="confirm" className={`field-input ${formik.touched.confirm && formik.errors.confirm ? 'error' : ''}`} placeholder="••••••••" {...formik.getFieldProps('confirm')} />
                  <button type="button" className="eye-btn" onClick={() => setShowConf(v => !v)} tabIndex={-1}><EyeIcon open={showConf} /></button>
                </div>
                {formik.touched.confirm && formik.errors.confirm && <p className="field-error">{formik.errors.confirm}</p>}
              </div>
            )}

            {tab === 'signin' && <div className="forgot-row"><button type="button" className="forgot-btn">Forgot password?</button></div>}

            <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? <span className="spinner" /> : <>{tab === 'signin' ? 'Sign In' : 'Create Account'}<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>}
            </button>

            <div className="or-divider"><span>or continue with</span></div>
            <div className="social-row">
              <button type="button" className="social-btn"><GoogleIcon /><span>Google</span></button>
              <button type="button" className="social-btn"><AppleIcon /><span>Apple</span></button>
            </div>
          </form>

          <p className="auth-footer">
            {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" className="footer-link" onClick={() => switchTab(tab === 'signin' ? 'signup' : 'signin')}>{tab === 'signin' ? 'Create one' : 'Sign in'}</button>
          </p>
        </div>
      </div>
    </div>
  )
}
