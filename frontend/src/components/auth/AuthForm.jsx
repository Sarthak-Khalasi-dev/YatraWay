import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleIcon, AppleIcon, EyeIcon, MailIcon, LockIcon, UserIcon } from '../icons/AuthIcons'

export default function AuthForm() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('signin')
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1500)
  }

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setForm({ email: '', password: '', name: '', confirmPassword: '' })
    setShowPass(false)
    setShowConfirmPass(false)
  }

  return (
    <div className="flex-1 md:flex-[0_0_48%] flex items-center justify-center p-[24px_20px_36px] md:p-[36px_40px] bg-cream overflow-y-auto relative z-0">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at 70% 20%, rgba(201,150,58,0.06) 0%, transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(26,47,78,0.04) 0%, transparent 65%)' }} />

      <div className="relative w-full max-w-[430px] bg-white rounded-[28px] p-[28px_22px] md:p-[38px_40px] shadow-lg border border-black/5 opacity-0 translate-y-[28px] animate-[fadeUp_0.75s_cubic-bezier(0.16,1,0.3,1)_0.18s_forwards] z-10">
        
        {/* Tabs */}
        <div className="grid grid-cols-2 bg-cream rounded-[14px] p-[4px] mb-[30px] border border-border-light">
          {['signin', 'signup'].map(t => (
            <button
              key={t}
              className={`border-none bg-transparent py-[11px] px-[16px] rounded-[11px] text-[14px] font-medium font-body text-text-mid cursor-pointer transition-all duration-300 tracking-[0.1px] ${tab === t ? 'bg-white !text-text-dark shadow-sm !font-semibold' : ''}`}
              onClick={() => handleTabChange(t)}
              type="button"
            >
              {t === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Heading */}
        <div className="mb-[26px]">
          <h2 className="font-display text-[24px] font-bold text-text-dark mb-[7px] leading-[1.22] tracking-[-0.3px]">
            {tab === 'signin' ? 'Welcome back, Explorer!' : 'Start your adventure!'}
          </h2>
          <p className="text-[14px] text-text-mid leading-[1.55] font-normal">
            {tab === 'signin'
              ? 'Sign in to continue planning your adventures.'
              : 'Create an account to begin your journey.'}
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-[15px]" onSubmit={handleSubmit}>
          {tab === 'signup' && (
            <div className="flex flex-col gap-[7px]" key="name-field">
              <label className="text-[13px] font-medium text-text-dark tracking-[0.1px]">Full Name</label>
              <div className="relative flex items-center group">
                <span className="absolute left-[14px] text-text-light flex pointer-events-none z-10"><UserIcon /></span>
                <input
                  type="text"
                  className="w-full py-[13px] pr-[46px] pl-[44px] border-[1.5px] border-border rounded-[13px] text-[14px] font-body text-text-dark bg-white transition-all duration-200 outline-none tracking-[0.1px] placeholder:text-text-light placeholder:font-light hover:border-black/20 focus:border-gold focus:ring-[3.5px] focus:ring-gold/10"
                  placeholder="Ananya Sharma"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-medium text-text-dark tracking-[0.1px]">Email Address</label>
            <div className="relative flex items-center">
              <span className="absolute left-[14px] text-text-light flex pointer-events-none z-10"><MailIcon /></span>
              <input
                type="email"
                className="w-full py-[13px] pr-[46px] pl-[44px] border-[1.5px] border-border rounded-[13px] text-[14px] font-body text-text-dark bg-white transition-all duration-200 outline-none tracking-[0.1px] placeholder:text-text-light placeholder:font-light hover:border-black/20 focus:border-gold focus:ring-[3.5px] focus:ring-gold/10"
                placeholder="ananya@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-medium text-text-dark tracking-[0.1px]">Password</label>
            <div className="relative flex items-center">
              <span className="absolute left-[14px] text-text-light flex pointer-events-none z-10"><LockIcon /></span>
              <input
                type={showPass ? 'text' : 'password'}
                className="w-full py-[13px] pr-[46px] pl-[44px] border-[1.5px] border-border rounded-[13px] text-[14px] font-body text-text-dark bg-white transition-all duration-200 outline-none tracking-[0.1px] placeholder:text-text-light placeholder:font-light hover:border-black/20 focus:border-gold focus:ring-[3.5px] focus:ring-gold/10"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-[13px] border-none bg-transparent cursor-pointer text-text-light flex p-[5px] rounded-[7px] transition-colors duration-200 hover:text-text-mid hover:bg-cream"
                onClick={() => setShowPass(v => !v)}
                tabIndex={-1}
              >
                <EyeIcon open={showPass} />
              </button>
            </div>
          </div>

          {tab === 'signup' && (
            <div className="flex flex-col gap-[7px]" key="confirm-field">
              <label className="text-[13px] font-medium text-text-dark tracking-[0.1px]">Confirm Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-[14px] text-text-light flex pointer-events-none z-10"><LockIcon /></span>
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  className="w-full py-[13px] pr-[46px] pl-[44px] border-[1.5px] border-border rounded-[13px] text-[14px] font-body text-text-dark bg-white transition-all duration-200 outline-none tracking-[0.1px] placeholder:text-text-light placeholder:font-light hover:border-black/20 focus:border-gold focus:ring-[3.5px] focus:ring-gold/10"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-[13px] border-none bg-transparent cursor-pointer text-text-light flex p-[5px] rounded-[7px] transition-colors duration-200 hover:text-text-mid hover:bg-cream"
                  onClick={() => setShowConfirmPass(v => !v)}
                  tabIndex={-1}
                >
                  <EyeIcon open={showConfirmPass} />
                </button>
              </div>
            </div>
          )}

          {tab === 'signin' && (
            <div className="flex justify-end -mt-[4px]">
              <button type="button" className="border-none bg-transparent text-[13px] text-text-mid cursor-pointer font-body p-0 transition-colors duration-200 font-medium hover:text-gold">Forgot password?</button>
            </div>
          )}

          <button type="submit" className={`relative overflow-hidden flex items-center justify-center gap-[9px] w-full p-[15px] bg-charcoal text-white border-none rounded-[14px] text-[15px] font-semibold font-body cursor-pointer tracking-[0.3px] transition-all duration-200 mt-[4px] min-h-[52px] group disabled:cursor-not-allowed disabled:opacity-85 ${loading ? 'pointer-events-none' : 'hover:bg-charcoal-mid hover:-translate-y-[1px] hover:shadow-[0_8px_28px_rgba(26,31,46,0.35)] active:translate-y-0 active:shadow-none'}`} disabled={loading}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            {loading ? (
              <span className="w-[20px] h-[20px] border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {tab === 'signin' ? 'Sign In' : 'Create Account'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-[14px] text-text-light text-[13px] font-normal before:content-[''] before:flex-1 before:h-[1px] before:bg-border after:content-[''] after:flex-1 after:h-[1px] after:bg-border">
            <span>or continue with</span>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-[12px]">
            <button type="button" className="flex items-center justify-center gap-[9px] p-[12px_16px] bg-white border-[1.5px] border-border rounded-[13px] text-[14px] font-medium font-body text-text-dark cursor-pointer transition-all duration-200 tracking-[0.1px] hover:bg-cream hover:border-black/15 hover:-translate-y-[1px] hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)] active:translate-y-0">
              <GoogleIcon />
              <span>Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-[9px] p-[12px_16px] bg-white border-[1.5px] border-border rounded-[13px] text-[14px] font-medium font-body text-text-dark cursor-pointer transition-all duration-200 tracking-[0.1px] hover:bg-cream hover:border-black/15 hover:-translate-y-[1px] hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)] active:translate-y-0">
              <AppleIcon />
              <span>Apple</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center mt-[22px] text-[14px] text-text-mid">
          {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="border-none bg-transparent text-[14px] font-semibold font-body text-gold cursor-pointer underline underline-offset-2 decoration-gold/40 p-0 transition-colors duration-200 hover:text-[#a07828] hover:decoration-[#a07828]"
            onClick={() => handleTabChange(tab === 'signin' ? 'signup' : 'signin')}
          >
            {tab === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
