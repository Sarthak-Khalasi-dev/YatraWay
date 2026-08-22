export default function Header() {
  return (
    <header className="flex items-center justify-between p-[28px_36px_0] bg-cream-mid animate-[fadeDown_0.5s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]">
      <div>
        <h1 className="font-display text-[26px] font-bold text-text-dark mb-[4px] tracking-[-0.3px]">
          Good morning, Ananya!{' '}
          <span className="inline-block w-[32px] h-[32px] rounded-full overflow-hidden ml-[8px] align-middle border-[2px] border-gold/25">
            <img
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&q=80&fit=crop&crop=face"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </span>
        </h1>
        <p className="text-[14px] text-text-mid font-normal">Ready for your next adventure?</p>
      </div>
      <button className="relative overflow-hidden flex items-center gap-[8px] p-[12px_22px] bg-charcoal text-white border-none rounded-[13px] text-[14px] font-semibold font-body cursor-pointer transition-all duration-200 tracking-[0.2px] hover:bg-charcoal-mid hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(26,31,46,0.3)] after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/10 after:to-transparent after:pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Plan New Trip
      </button>
    </header>
  )
}
