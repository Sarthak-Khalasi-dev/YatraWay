import { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import './Messages.css'

const CONTACTS = [
  {
    id: 1,
    name: 'Wanderlust Concierge',
    role: 'Private Travel Assistant',
    badge: 'VERIFIED CONCIERGE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&q=80&auto=format&fit=crop',
    lastMsg: 'Your Bali Villa reservation is confirmed with airport pickup.',
    time: '10:25 AM',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Aarav Sharma',
    role: 'Co-Traveler · Ladakh Trek',
    badge: 'TRAVEL BUDDY',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&q=80&auto=format&fit=crop',
    lastMsg: 'I have shared the high-pass acclimatization gear list.',
    time: '1h ago',
    unread: 1,
    online: true,
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Alpine Guide · Swiss Alps',
    badge: 'CERTIFIED GUIDE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&q=80&auto=format&fit=crop',
    lastMsg: 'Weather forecast for the Bernese pass looks clear for tomorrow.',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: 'Komaneka Resort & Spa',
    role: 'Boutique Property · Ubud',
    badge: 'HOTEL HOST',
    avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&h=120&q=80&auto=format&fit=crop',
    lastMsg: 'Your private poolside breakfast has been scheduled for 8:30 AM.',
    time: '2 days ago',
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: 'Rohan Patel',
    role: 'Traveler · Spiti Expedition',
    badge: 'TRAVEL BUDDY',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&q=80&auto=format&fit=crop',
    lastMsg: 'Which homestay are we booking in Kaza for the night?',
    time: '3 days ago',
    unread: 0,
    online: true,
  },
]

const INITIAL_CONVERSATIONS = {
  1: [
    { id: 101, from: 'them', text: 'Good morning Ananya! Your Bali luxury stay at Komaneka Bisma has been fully confirmed.', time: '10:20 AM' },
    { id: 102, from: 'them', text: 'Private airport chauffeur service will be waiting at Denpasar International Airport with your name board.', time: '10:21 AM' },
    { id: 103, from: 'me', text: 'Thank you so much! Could you please verify if early check-in at 1:00 PM is available?', time: '10:24 AM' },
    { id: 104, from: 'them', text: 'Your Bali Villa reservation is confirmed with airport pickup and complimentary early check-in has been noted.', time: '10:25 AM' },
  ],
  2: [
    { id: 201, from: 'them', text: 'Hey Ananya, are you packing for the Pangong & Khardung La pass expedition?', time: '09:15 AM' },
    { id: 202, from: 'me', text: 'Yes, getting thermal layers ready. Did you check the oxygen cylinder rental in Leh?', time: '09:30 AM' },
    { id: 203, from: 'them', text: 'I have shared the high-pass acclimatization gear list and confirmed the backup vehicle.', time: '1h ago' },
  ],
  3: [
    { id: 301, from: 'them', text: 'Hello! I am Elena, your alpine guide for the Swiss Alps Matterhorn trek.', time: 'Aug 20' },
    { id: 302, from: 'them', text: 'Weather forecast for the Bernese pass looks clear for tomorrow. Trek commences at 07:00 AM.', time: 'Yesterday' },
  ],
  4: [
    { id: 401, from: 'them', text: 'Warm greetings from Ubud. Your valley-view pool villa is prepared for your arrival.', time: 'Aug 19' },
    { id: 402, from: 'them', text: 'Your private poolside breakfast has been scheduled for 8:30 AM.', time: '2 days ago' },
  ],
  5: [
    { id: 501, from: 'them', text: 'Hey! Planning to leave for Spiti via Manali route on Thursday.', time: 'Aug 18' },
    { id: 502, from: 'them', text: 'Which homestay are we booking in Kaza for the night?', time: '3 days ago' },
  ],
}

export default function Messages() {
  const [activeContactId, setActiveContactId] = useState(1)
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef(null)

  const activeContact = CONTACTS.find((c) => c.id === activeContactId) || CONTACTS[0]
  const currentMessages = conversations[activeContactId] || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeContactId, currentMessages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    const newMsg = {
      id: Date.now(),
      from: 'me',
      text: messageInput.trim(),
      time: 'Just now',
    }

    setConversations((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg],
    }))
    setMessageInput('')

    // Auto concierge response simulation
    if (activeContactId === 1) {
      setTimeout(() => {
        setConversations((prev) => ({
          ...prev,
          [1]: [
            ...(prev[1] || []),
            {
              id: Date.now() + 1,
              from: 'them',
              text: 'Noted with pleasure. Our concierge desk is reviewing your request and will provide instant updates.',
              time: 'Just now',
            },
          ],
        }))
      }, 1200)
    }
  }

  const filteredContacts = CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="msg-root">
      <Sidebar />

      <div className="msg-container">
        {/* ── LEFT CONTACT LIST ── */}
        <aside className="msg-sidebar">
          <div className="msg-sidebar-header">
            <h2 className="msg-title">Messages & Concierge</h2>
            <p className="msg-sub">Private travel assistants & verified companions</p>

            <div className="msg-search-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8C867A" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="msg-contact-list">
            {filteredContacts.map((contact) => {
              const isActive = contact.id === activeContactId
              return (
                <div
                  key={contact.id}
                  className={`msg-contact-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveContactId(contact.id)}
                >
                  <div className="msg-avatar-wrapper">
                    <img src={contact.avatar} alt={contact.name} className="msg-contact-avatar" />
                    {contact.online && <span className="msg-online-badge" />}
                  </div>

                  <div className="msg-contact-info">
                    <div className="msg-contact-row1">
                      <h4 className="msg-contact-name">{contact.name}</h4>
                      <span className="msg-contact-time">{contact.time}</span>
                    </div>

                    <span className="msg-badge-tag">{contact.badge}</span>
                    <p className="msg-preview-text">{contact.lastMsg}</p>
                  </div>

                  {contact.unread > 0 && !isActive && (
                    <span className="msg-unread-dot">{contact.unread}</span>
                  )}
                </div>
              )
            })}
          </div>
        </aside>

        {/* ── RIGHT CHAT WINDOW ── */}
        <main className="msg-chat-window">
          {/* Header */}
          <header className="msg-chat-header">
            <div className="msg-active-user">
              <div className="msg-avatar-wrapper">
                <img src={activeContact.avatar} alt={activeContact.name} className="msg-active-avatar" />
                {activeContact.online && <span className="msg-online-badge" />}
              </div>
              <div>
                <div className="msg-name-badge-row">
                  <h3 className="msg-active-name">{activeContact.name}</h3>
                  <span className="msg-active-badge">{activeContact.badge}</span>
                </div>
                <p className="msg-active-status">
                  {activeContact.online ? 'Active now' : 'Last seen recently'} · {activeContact.role}
                </p>
              </div>
            </div>

            <div className="msg-chat-actions">
              <button className="msg-action-btn" title="Call Concierge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>
              <button className="msg-action-btn" title="Itinerary Details">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </button>
            </div>
          </header>

          {/* Messages Stream */}
          <div className="msg-stream">
            <div className="msg-date-divider">
              <span>ENCRYPTED END-TO-END LUXURY CONCIERGE</span>
            </div>

            {currentMessages.map((msg) => {
              const isMe = msg.from === 'me'
              return (
                <div key={msg.id} className={`msg-bubble-row ${isMe ? 'me' : 'them'}`}>
                  {!isMe && (
                    <img src={activeContact.avatar} alt="Avatar" className="msg-bubble-avatar" />
                  )}
                  <div className={`msg-bubble ${isMe ? 'msg-bubble-me' : 'msg-bubble-them'}`}>
                    <p className="msg-bubble-text">{msg.text}</p>
                    <span className="msg-bubble-time">
                      {msg.time} {isMe && '· ✓✓'}
                    </span>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form className="msg-input-form" onSubmit={handleSendMessage}>
            <div className="msg-input-bar">
              <button type="button" className="msg-attach-btn" title="Attach Travel Document">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C867A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>

              <input
                type="text"
                className="msg-text-input"
                placeholder={`Message ${activeContact.name}...`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />

              <button type="submit" className="msg-send-btn" disabled={!messageInput.trim()}>
                <span>Send</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
