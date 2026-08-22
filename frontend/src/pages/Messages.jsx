import { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import './Messages.css'

const CONTACTS = [
  { id: 1, name: 'NomadNest Support',    avatar: '🎯', role: 'Official Support',     lastMsg: 'Your booking is confirmed!', time: '2m',  unread: 2, online: true  },
  { id: 2, name: 'Rahul Verma',          avatar: '👨', role: 'Travel Buddy',          lastMsg: 'Bali trip looks amazing!',   time: '1h',  unread: 1, online: true  },
  { id: 3, name: 'AI Trip Planner',      avatar: '🤖', role: 'AI Assistant',          lastMsg: 'I found 3 itineraries for…', time: '3h',  unread: 0, online: true  },
  { id: 4, name: 'Priya Kapoor',         avatar: '👩', role: 'Travel Buddy',          lastMsg: 'Are you joining the tour?',  time: '1d',  unread: 0, online: false },
  { id: 5, name: 'Hotel Komaneka',       avatar: '🏨', role: 'Property',              lastMsg: 'Welcome to Bali! Check-in…', time: '2d',  unread: 0, online: false },
  { id: 6, name: 'Sneha Reddy',          avatar: '👩', role: 'Travel Buddy',          lastMsg: 'Which flights did you book?', time: '3d',  unread: 0, online: true  },
]

const MESSAGES = {
  1: [
    { from: 'them', text: 'Hello Ananya! Your Bali booking has been confirmed 🎉', time: '10:22 AM' },
    { from: 'them', text: 'Flight 6E-1234 and Hotel Komaneka at Bisma are all set.', time: '10:22 AM' },
    { from: 'me',   text: 'That is amazing news! Thank you so much.', time: '10:24 AM' },
    { from: 'them', text: 'Your booking is confirmed! Have a wonderful trip! ✈️', time: '10:25 AM' },
  ],
  3: [
    { from: 'them', text: 'Hi Ananya! I am your AI Trip Planner 🤖 How can I help today?', time: '9:00 AM' },
    { from: 'me',   text: 'Plan a 5-day itinerary for Santorini for 2 people', time: '9:01 AM' },
    { from: 'them', text: 'Great! I found 3 itineraries for Santorini. Here\'s the top one:\n\nDay 1: Arrive + Oia sunset\nDay 2: Caldera boat tour\nDay 3: Black Beach + Wine tour\nDay 4: Akrotiri ruins\nDay 5: Fira shopping + depart', time: '9:02 AM' },
  ],
  2: [
    { from: 'them', text: 'Hey! Saw you are going to Bali soon 🌴', time: 'Yesterday' },
    { from: 'me',   text: 'Yes! Super excited. Are you going too?', time: 'Yesterday' },
    { from: 'them', text: 'Bali trip looks amazing! Wish I could join!', time: '1h ago' },
  ],
}

export default function Messages() {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(1)
  const [msgs, setMsgs] = useState(MESSAGES)
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t) }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [active, msgs])

  const contact = CONTACTS.find(c => c.id === active)

  const send = () => {
    if (!input.trim()) return
    setMsgs(p => ({
      ...p,
      [active]: [...(p[active] || []), { from: 'me', text: input.trim(), time: 'Now' }]
    }))
    setInput('')
    // Simulate reply
    if (active === 3) {
      setTimeout(() => {
        setMsgs(p => ({
          ...p,
          [active]: [...(p[active] || []), { from: 'them', text: '🤖 Processing your request... Give me a moment!', time: 'Now' }]
        }))
      }, 1000)
    }
  }

  const filtered = CONTACTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className={`page-shell ${mounted ? 'mounted' : ''}`}>
      <Sidebar />
      <div className="page-body">
        <Topbar title="Messages" subtitle="Stay connected with your travel network" />
        <div className="msg-layout">

          {/* Contacts sidebar */}
          <div className="msg-contacts">
            <div className="msg-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {filtered.map(c => (
              <button key={c.id} className={`msg-contact ${active === c.id ? 'msg-contact--active' : ''}`} onClick={() => setActive(c.id)}>
                <div className="msg-contact-avatar-wrap">
                  <span className="msg-contact-avatar">{c.avatar}</span>
                  {c.online && <span className="msg-online-dot" />}
                </div>
                <div className="msg-contact-info">
                  <div className="msg-contact-row">
                    <p className="msg-contact-name">{c.name}</p>
                    <p className="msg-contact-time">{c.time}</p>
                  </div>
                  <div className="msg-contact-row">
                    <p className="msg-contact-last">{c.lastMsg}</p>
                    {c.unread > 0 && <span className="msg-unread-badge">{c.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Chat area */}
          <div className="msg-chat">
            {/* Chat header */}
            <div className="msg-chat-header">
              <span className="msg-chat-avatar">{contact.avatar}</span>
              <div>
                <p className="msg-chat-name">{contact.name}</p>
                <p className="msg-chat-role">{contact.role} {contact.online ? '· 🟢 Online' : '· Offline'}</p>
              </div>
              <div className="msg-chat-actions">
                <button className="tb-icon-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </button>
                <button className="tb-icon-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="msg-messages">
              {(msgs[active] || []).map((m, i) => (
                <div key={i} className={`msg-bubble-wrap ${m.from === 'me' ? 'msg-bubble-wrap--me' : ''}`}>
                  {m.from === 'them' && <span className="msg-bubble-avatar">{contact.avatar}</span>}
                  <div className={`msg-bubble ${m.from === 'me' ? 'msg-bubble--me' : 'msg-bubble--them'}`}>
                    <p>{m.text}</p>
                    <span className="msg-bubble-time">{m.time}</span>
                  </div>
                </div>
              ))}
              {(!msgs[active] || msgs[active].length === 0) && (
                <div className="msg-empty">
                  <span style={{ fontSize:40 }}>{contact.avatar}</span>
                  <p>Start a conversation with {contact.name}</p>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="msg-input-row">
              <button className="msg-attach-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              <input
                className="msg-input"
                placeholder={`Message ${contact.name}...`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              />
              <button className="msg-emoji-btn">😊</button>
              <button className="msg-send-btn" onClick={send} disabled={!input.trim()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
