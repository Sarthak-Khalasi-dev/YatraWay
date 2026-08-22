import { useState } from 'react'

const MOUNTAIN_BG = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=85&fit=crop'
const BALI_THUMB = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=120&q=80&fit=crop'

export default function AuthHero() {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="relative flex-none md:flex-[0_0_52%] flex flex-col justify-end overflow-hidden h-[44vh] md:h-auto min-h-[280px] md:min-h-0">
      <img
        src={MOUNTAIN_BG}
        alt="Mountain landscape"
        className={`absolute inset-0 w-full h-full object-cover transform transition-all duration-[6000ms] ease-out opacity-0 scale-105 ${imgLoaded ? 'opacity-100 !scale-100' : ''}`}
        onLoad={() => setImgLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1220]/60 via-[#0a1220]/15 to-[#0a1220]/70 pointer-events-none" />

      {/* Logo */}
      <div className="absolute top-[30px] left-[30px] flex items-center gap-[11px] z-10 opacity-0 animate-[fadeDown_0.65s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards]">
        <div className="w-[42px] h-[42px] rounded-[12px] bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 18 12 2 21 18"/>
            <path d="M9 18 12 12 15 18"/>
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-body text-[12.5px] font-bold text-white tracking-[2.5px]">WANDERLUST</span>
          <span className="font-body text-[9.5px] font-normal text-white/60 tracking-[3.5px] mt-[3px]">TRAVEL</span>
        </div>
      </div>

      {/* Hero copy */}
      <div className="relative z-10 px-[44px] pb-[30px] opacity-0 animate-[fadeUp_0.75s_cubic-bezier(0.16,1,0.3,1)_0.25s_forwards]">
        <h1 className="font-display text-[clamp(38px,4.8vw,60px)] font-extrabold text-white leading-[1.08] tracking-[-0.8px] mb-[16px]">
          Explore More
          <br />
          <span className="text-gold-light">Live More</span>
        </h1>
        <p className="text-[14.5px] text-white/80 leading-[1.65] max-w-[380px] mb-[26px] font-light tracking-[0.1px]">
          The world is waiting for you. Start your journey today and collect unforgettable moments.
        </p>
        <ul className="flex flex-col gap-[11px]">
          {['Curated destinations worldwide', 'AI-powered trip planning', 'Exclusive member deals'].map((f, i) => (
            <li key={f} className="flex items-center gap-[11px] text-[14px] text-white/90 font-normal opacity-0 animate-[fadeRight_0.55s_cubic-bezier(0.16,1,0.3,1)_forwards]" style={{ animationDelay: `${0.5 + i * 0.12}s` }}>
              <span className="w-[22px] h-[22px] rounded-full bg-gold flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(201,150,58,0.4)]">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Trip card */}
      <div className="relative z-10 mx-[24px] mb-[24px] p-[14px_18px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[18px] flex items-center gap-[15px] opacity-0 animate-[fadeUp_0.65s_cubic-bezier(0.16,1,0.3,1)_0.8s_forwards] transition-all duration-200 hover:bg-white/20 hover:-translate-y-[2px]">
        <img src={BALI_THUMB} alt="Bali" className="w-[48px] h-[48px] rounded-[12px] object-cover shrink-0 border-[1.5px] border-white/20" />
        <div className="flex-1">
          <p className="text-[13.5px] font-semibold text-white mb-[3px]">Next Trip: Bali, Indonesia</p>
          <p className="text-[12px] text-white/60 font-light">20 May — 02 June 2024 · 12 Days</p>
        </div>
        <div className="text-[12px] font-semibold text-gold-light bg-gold/20 border border-gold/30 rounded-full px-[14px] py-[6px] whitespace-nowrap tracking-[0.2px]">12 Days to go</div>
      </div>
    </div>
  )
}
