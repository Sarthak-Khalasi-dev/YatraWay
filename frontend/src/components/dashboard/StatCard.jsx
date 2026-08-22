export default function StatCard({ s, i }) {
  return (
    <div 
      className="bg-white rounded-[20px] p-[22px] flex flex-col gap-[4px] border border-black/5 animate-[fadeUp_0.5s_cubic-bezier(0.16,1,0.3,1)_both] transition-all duration-200 relative overflow-hidden hover:-translate-y-[4px] hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] before:content-[''] before:absolute before:top-0 before:right-0 before:w-[80px] before:h-[80px] before:rounded-[0_20px_0_100%] before:opacity-5" 
      style={{ animationDelay: `${i * 0.08}s` }}
    >
      <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-[0_20px_0_100%] opacity-5 pointer-events-none" style={{ backgroundColor: i===0 ? '#4DB6A9' : i===1 ? '#7B8FD4' : i===2 ? '#E07B7B' : '#C9963A' }}></div>

      <div className="w-[44px] h-[44px] rounded-[12px] overflow-hidden mb-[10px] shrink-0 relative">
        <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">{s.svgIcon}</div>
      </div>
      <p className="font-display text-[28px] font-bold text-text-dark leading-none tracking-[-0.5px]">{s.value}</p>
      <p className="text-[11.5px] text-text-light font-medium uppercase tracking-[0.7px] mt-[2px]">{s.label}</p>
      <p className={`text-[11px] font-semibold mt-[6px] flex items-center gap-[3px] ${s.changeType === 'up' ? 'text-[#2A9D8F]' : 'text-gold'}`}>{s.change}</p>
    </div>
  )
}
