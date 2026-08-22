import { useNavigate } from 'react-router-dom'

export default function Sidebar({ activeNav, setActiveNav }) {
  const navigate = useNavigate()

  return (
    <aside className="w-[248px] shrink-0 bg-charcoal flex flex-col p-[26px_16px] h-screen overflow-hidden relative border-r border-white/5 before:content-[''] before:absolute before:-top-[60px] before:-left-[60px] before:w-[220px] before:h-[220px] before:bg-[radial-gradient(circle,rgba(201,150,58,0.09)_0%,transparent_70%)] before:pointer-events-none">
      
      <div className="flex items-center gap-[12px] px-[8px] mb-[38px]">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-gold/25 to-gold/10 border border-gold/35 flex items-center justify-center shadow-[0_2px_10px_rgba(201,150,58,0.15)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 18 12 2 21 18"/>
            <path d="M9 18 12 12 15 18"/>
          </svg>
        </div>
        <span className="text-[15px] font-semibold text-white tracking-[0.4px]">Wanderlust</span>
      </div>

      <nav className="flex flex-col gap-[3px] flex-1">
        {[
          { id: 'home',     label: 'Overview',  icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
          { id: 'trips',    label: 'My Trips',  icon: 'M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m4 13H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z' },
          { id: 'explore',  label: 'Explore',   icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
          { id: 'saved',    label: 'Saved',     icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
          { id: 'settings', label: 'Settings',  icon: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
        ].map(item => (
          <button
            key={item.id}
            className={`flex items-center gap-[13px] p-[12px_14px] border-none bg-transparent rounded-[11px] text-[14px] font-medium font-body cursor-pointer text-left w-full transition-all duration-200 relative tracking-[0.1px] hover:bg-white/5 hover:text-white/80 hover:pl-[18px] ${activeNav === item.id ? 'bg-gradient-to-br from-gold/20 to-gold/10 text-gold-light border border-gold/15 before:content-[""] before:absolute before:left-0 before:top-[20%] before:bottom-[20%] before:w-[3px] before:bg-gold before:rounded-[0_3px_3px_0]' : 'text-white/45'}`}
            onClick={() => setActiveNav(item.id)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              {item.icon.split(' M').map((d, i) => (
                <path key={i} d={i === 0 ? d : 'M' + d}/>
              ))}
            </svg>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-[10px] pt-[14px] px-[8px] border-t border-white/5 mt-[16px]">
        <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-gold to-[#e8a830] text-white flex items-center justify-center text-[14px] font-bold shrink-0 shadow-[0_2px_10px_rgba(201,150,58,0.3)]">A</div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[13px] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">Ananya Sharma</p>
          <p className="text-[11px] text-white/40 whitespace-nowrap overflow-hidden text-ellipsis mt-[1px]">ananya@example.com</p>
        </div>
        <button className="border-none bg-transparent text-white/30 cursor-pointer p-[7px] rounded-[8px] flex transition-colors duration-200 hover:text-white/85 hover:bg-white/5" onClick={() => navigate('/')} title="Sign out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}
