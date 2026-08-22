import { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../services/api'
import { supabase } from '../services/supabaseClient'
import {
  SparkleIcon,
  UsersIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldIcon,
  CompassIcon,
  MountainIcon,
  WaveIcon,
  MonumentIcon,
  LeafIcon,
  CheckCircleIcon,
} from '../components/icons/LuxuryIcons'
import './Messages.css'

// ── 1. INITIAL DEMO CONTACTS ──
const INITIAL_CONTACTS = [
  {
    id: 1,
    name: 'YatraWay Concierge',
    role: 'Private Travel Assistant',
    badge: 'VERIFIED CONCIERGE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&q=80&auto=format&fit=crop',
    lastMsg: 'Your Bali Villa reservation is confirmed with airport pickup.',
    time: '10:25 AM',
    unread: 2,
    online: true,
    category: 'Concierge',
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
    category: 'Buddy',
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
    category: 'Guide',
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
    category: 'Host',
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
    category: 'Buddy',
  },
]

// ── 2. PRE-LOADED CONVERSATION THREADS ──
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

// ── 3. DISCOVER PEOPLE / TRAVEL BUDDIES DIRECTORY ──
const PEOPLE_DIRECTORY = [
  {
    id: 101,
    name: 'Priya Sengupta',
    location: 'Kerala & Varkala, India',
    travelStyle: 'Wellness & Coastal',
    badge: 'VERIFIED EXPLORER',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&q=80&auto=format&fit=crop',
    bio: 'Ayurvedic retreat lover, solo female traveler, exploring backwater homestays & Kathakali heritage.',
    trips: 'Kerala 7-Day Retreat (Oct 2024)',
    icon: LeafIcon,
    safetyScore: '9.9/10',
    online: true,
  },
  {
    id: 102,
    name: 'Kabir Mehta',
    location: 'Jaipur & Udaipur, Rajasthan',
    travelStyle: 'Royal Heritage',
    badge: 'HERITAGE CURATOR',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&q=80&auto=format&fit=crop',
    bio: 'Architect & royal fort photographer. Looking for companions for Amber Fort sunrise walks & street food tours.',
    trips: 'Rajasthan Grand Circuit (Nov 2024)',
    icon: MonumentIcon,
    safetyScore: '9.8/10',
    online: true,
  },
  {
    id: 103,
    name: 'Natasha Varma',
    location: 'Ubud & Canggu, Bali',
    travelStyle: 'Luxury & Mindful',
    badge: 'SOLO NOMAD',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&q=80&auto=format&fit=crop',
    bio: 'Remote designer based between Bali & Mumbai. Love rainforest hikes, organic cafes, and scuba diving.',
    trips: 'Bali 10-Day Immersion (Nov 2024)',
    icon: WaveIcon,
    safetyScore: '9.9/10',
    online: true,
  },
  {
    id: 104,
    name: 'Devansh Kulkarni',
    location: 'Spiti & Zanskar, Himalayas',
    travelStyle: 'High-Altitude Trek',
    badge: 'ALPINE EXPLORER',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&q=80&auto=format&fit=crop',
    bio: 'Motorbike enthusiast & mountaineer. Looking for co-riders for the Manali-Kaza-Chandra Taal circuit.',
    trips: 'Spiti Valley Expedition (Oct 2024)',
    icon: MountainIcon,
    safetyScore: '9.7/10',
    online: false,
  },
  {
    id: 105,
    name: 'Marco Valenti',
    location: 'Amalfi Coast & Capri, Italy',
    travelStyle: 'Coastal & Gastronomy',
    badge: 'VERIFIED GUIDE',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&h=150&q=80&auto=format&fit=crop',
    bio: 'Private skipper and sommelier in Positano. Happy to share sailing itineraries and vineyard tours.',
    trips: 'Amalfi Yacht Charter (Oct 2024)',
    icon: WaveIcon,
    safetyScore: '9.9/10',
    online: false,
  },
]

export default function Messages() {
  const [activeTab, setActiveTab] = useState('chats') // 'chats' | 'people'
  const [contacts, setContacts] = useState(INITIAL_CONTACTS)
  const [activeContactId, setActiveContactId] = useState(1)
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [peopleFilter, setPeopleFilter] = useState('All')
  const [isTyping, setIsTyping] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [showDossierModal, setShowDossierModal] = useState(false)

  const messagesEndRef = useRef(null)
  const callTimerRef = useRef(null)

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0]
  const currentMessages = conversations[activeContactId] || []

  // ── Auto Scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeContactId, currentMessages, isTyping])

  // ── 1. SUPABASE REALTIME & PERSISTENCE INITIALIZATION ──
  useEffect(() => {
    // Load persisted messages from Supabase if table exists
    const fetchSupabaseMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true })

        if (data && data.length > 0 && !error) {
          const remoteGrouped = {}
          data.forEach((row) => {
            const cid = parseInt(row.contact_id) || row.contact_id
            if (!remoteGrouped[cid]) remoteGrouped[cid] = []
            remoteGrouped[cid].push({
              id: row.id,
              from: row.sender_type === 'user' ? 'me' : 'them',
              text: row.text,
              time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            })
          })

          setConversations((prev) => {
            const merged = { ...prev }
            Object.keys(remoteGrouped).forEach((cid) => {
              merged[cid] = [...(prev[cid] || []), ...remoteGrouped[cid]]
            })
            return merged
          })
        }
      } catch (e) {
        console.warn('Supabase messages load fallback:', e.message)
      }
    }

    fetchSupabaseMessages()

    // Subscribe to Supabase Realtime Channel
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const row = payload.new
          if (row && row.contact_id) {
            const cid = parseInt(row.contact_id) || row.contact_id
            const incomingMsg = {
              id: row.id,
              from: row.sender_type === 'user' ? 'me' : 'them',
              text: row.text,
              time: new Date(row.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }

            setConversations((prev) => {
              const currentList = prev[cid] || []
              if (currentList.some((m) => m.id === incomingMsg.id)) return prev
              return {
                ...prev,
                [cid]: [...currentList, incomingMsg],
              }
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // ── 2. CALL SIMULATION TIMER ──
  useEffect(() => {
    if (showCallModal) {
      setCallDuration(0)
      callTimerRef.current = setInterval(() => {
        setCallDuration((d) => d + 1)
      }, 1000)
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current)
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current)
    }
  }, [showCallModal])

  const formatCallTimer = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // ── 3. SEND MESSAGE HANDLER ──
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    const textToSend = messageInput.trim()
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const localMsg = {
      id: Date.now(),
      from: 'me',
      text: textToSend,
      time: nowTime,
    }

    // 1. Optimistic UI update
    setConversations((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), localMsg],
    }))
    setMessageInput('')

    // 2. Update contact preview snippet
    setContacts((prev) =>
      prev.map((c) => (c.id === activeContactId ? { ...c, lastMsg: textToSend, time: nowTime } : c))
    )

    // 3. Persist to Supabase
    try {
      await supabase.from('messages').insert([
        {
          contact_id: String(activeContactId),
          sender_type: 'user',
          text: textToSend,
        },
      ])
    } catch (err) {
      console.warn('Supabase insert message skipped:', err.message)
    }

    // 4. Intelligent Concierge Auto-Reply (Powered by Groq AI)
    if (activeContactId === 1) {
      setIsTyping(true)
      try {
        const res = await api.post('/gemini/concierge-reply', {
          message: textToSend,
          contactName: activeContact.name,
        })

        const replyContent =
          res.data?.reply ||
          'Certainly! Our luxury coordination desk has recorded your request and is confirming with our private partners.'

        setTimeout(async () => {
          setIsTyping(false)
          const aiReply = {
            id: Date.now() + 1,
            from: 'them',
            text: replyContent,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }

          setConversations((prev) => ({
            ...prev,
            [1]: [...(prev[1] || []), aiReply],
          }))

          setContacts((prev) =>
            prev.map((c) => (c.id === 1 ? { ...c, lastMsg: replyContent, time: aiReply.time } : c))
          )

          try {
            await supabase.from('messages').insert([
              {
                contact_id: '1',
                sender_type: 'contact',
                text: replyContent,
              },
            ])
          } catch (e) {
            // fallback
          }
        }, 1200)
      } catch (err) {
        setIsTyping(false)
      }
    } else {
      // Simulate companion / guide response
      setTimeout(() => {
        const replyBuddy = {
          id: Date.now() + 1,
          from: 'them',
          text: `Got it! Looking forward to coordinating our plans for ${activeContact.role.split('·')[1]?.trim() || 'the trip'}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        setConversations((prev) => ({
          ...prev,
          [activeContactId]: [...(prev[activeContactId] || []), replyBuddy],
        }))
      }, 1500)
    }
  }

  // ── 4. CONNECT WITH DISCOVERED TRAVEL BUDDY ──
  const handleConnectWithPerson = (person) => {
    const existingContact = contacts.find((c) => c.name === person.name)
    let targetId = existingContact ? existingContact.id : person.id

    if (!existingContact) {
      const newContact = {
        id: person.id,
        name: person.name,
        role: `Co-Traveler · ${person.location.split(',')[0]}`,
        badge: person.badge,
        avatar: person.avatar,
        lastMsg: `Connected regarding ${person.trips}`,
        time: 'Just now',
        unread: 0,
        online: person.online,
        category: 'Buddy',
      }
      setContacts((prev) => [newContact, ...prev])

      setConversations((prev) => ({
        ...prev,
        [person.id]: [
          {
            id: Date.now(),
            from: 'them',
            text: `Hi Ananya! Great to connect with you on YatraWay. I saw you are also exploring ${person.location.split(',')[0]}!`,
            time: 'Just now',
          },
        ],
      }))
    }

    setActiveContactId(targetId)
    setActiveTab('chats')
  }

  // Filter contacts by search
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter people directory
  const filteredPeople = PEOPLE_DIRECTORY.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.travelStyle.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    if (peopleFilter === 'Adventure') return p.travelStyle.includes('Trek') || p.travelStyle.includes('Adventure')
    if (peopleFilter === 'Heritage') return p.travelStyle.includes('Heritage')
    if (peopleFilter === 'Wellness') return p.travelStyle.includes('Wellness')
    if (peopleFilter === 'Coastal') return p.travelStyle.includes('Coastal')
    return true
  })

  return (
    <div className="msg-root">
      <Sidebar />

      <div className="msg-container">
        {/* ═════════════════════════════════════════════════════════════
            LEFT SIDEBAR: CHATS & DISCOVER PEOPLE
        ═════════════════════════════════════════════════════════════ */}
        <aside className="msg-sidebar">
          <div className="msg-sidebar-header">
            <div className="msg-top-nav-tabs">
              <button
                className={`msg-nav-pill ${activeTab === 'chats' ? 'active' : ''}`}
                onClick={() => setActiveTab('chats')}
              >
                <span>Conversations</span>
                <span className="pill-count">{contacts.length}</span>
              </button>
              <button
                className={`msg-nav-pill ${activeTab === 'people' ? 'active' : ''}`}
                onClick={() => setActiveTab('people')}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <UsersIcon size={12} color="currentColor" /> Discover People
                </span>
              </button>
            </div>

            <div className="msg-search-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8C867A" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder={activeTab === 'chats' ? 'Search conversations...' : 'Search people or destinations...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Contact List */}
          {activeTab === 'chats' ? (
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
          ) : (
            /* Left Mini People Summary */
            <div className="msg-left-people-list">
              <p className="people-sidebar-hint">Verified Co-Travelers & Certified Guides</p>
              {filteredPeople.map((person) => (
                <div
                  key={person.id}
                  className="msg-person-mini-card"
                  onClick={() => handleConnectWithPerson(person)}
                >
                  <div className="msg-avatar-wrapper">
                    <img src={person.avatar} alt={person.name} className="msg-contact-avatar" />
                    {person.online && <span className="msg-online-badge" />}
                  </div>
                  <div className="msg-contact-info">
                    <h4 className="msg-contact-name">{person.name}</h4>
                    <span className="person-mini-loc">{person.location}</span>
                  </div>
                  <button className="person-connect-mini-btn" title="Message">
                    →
                  </button>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* ═════════════════════════════════════════════════════════════
            RIGHT MAIN WINDOW: CHAT OR DISCOVER PEOPLE DIRECTORY
        ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'chats' ? (
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
                <button
                  className="msg-action-btn"
                  title="Call Concierge"
                  onClick={() => setShowCallModal(true)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </button>
                <button
                  className="msg-action-btn"
                  title="Itinerary Details"
                  onClick={() => setShowDossierModal(true)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ShieldIcon size={12} color="#D4A843" /> ENCRYPTED END-TO-END LUXURY CONCIERGE
                </span>
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

              {/* Typing Indicator */}
              {isTyping && (
                <div className="msg-bubble-row them">
                  <img src={activeContact.avatar} alt="Avatar" className="msg-bubble-avatar" />
                  <div className="msg-bubble msg-bubble-them typing-indicator-box">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form className="msg-input-form" onSubmit={handleSendMessage}>
              <div className="msg-input-bar">
                <button type="button" className="msg-attach-btn" title="Attach Travel Voucher">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C867A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </form>
          </main>
        ) : (
          /* ── DISCOVER PEOPLE FULL DIRECTORY VIEW ── */
          <main className="msg-people-directory">
            <header className="people-dir-header">
              <div>
                <span className="people-dir-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <UsersIcon size={12} color="#D4A843" /> VERIFIED TRAVEL COMMUNITY
                </span>
                <h2 className="people-dir-title">Discover Co-Travelers & Local Guides</h2>
                <p className="people-dir-sub">
                  Connect with verified solo travelers, certified alpine guides, and boutique hosts sharing your destination itinerary.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="people-filter-chips">
                {['All', 'Adventure', 'Heritage', 'Wellness', 'Coastal'].map((chip) => (
                  <button
                    key={chip}
                    className={`people-chip-btn ${peopleFilter === chip ? 'active' : ''}`}
                    onClick={() => setPeopleFilter(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </header>

            {/* People Grid */}
            <div className="people-cards-grid">
              {filteredPeople.map((person) => {
                const IconComponent = person.icon || CompassIcon
                return (
                  <div key={person.id} className="person-editorial-card">
                    <div className="pec-header-row">
                      <div className="pec-avatar-wrap">
                        <img src={person.avatar} alt={person.name} className="pec-avatar" />
                        {person.online && <span className="msg-online-badge" />}
                      </div>
                      <div>
                        <div className="pec-name-badge">
                          <h3 className="pec-name">{person.name}</h3>
                          <span className="pec-badge">{person.badge}</span>
                        </div>
                        <span className="pec-loc" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <MapPinIcon size={11} color="#D4A843" /> {person.location}
                        </span>
                      </div>
                    </div>

                    <p className="pec-bio">{person.bio}</p>

                    <div className="pec-meta-box">
                      <div className="pec-meta-item">
                        <span className="pmi-lbl">UPCOMING ESCAPE</span>
                        <span className="pmi-val">{person.trips}</span>
                      </div>
                      <div className="pec-meta-item">
                        <span className="pmi-lbl">STYLE & SAFETY</span>
                        <span className="pmi-val" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <IconComponent size={12} color="#D4A843" /> {person.travelStyle} · {person.safetyScore}
                        </span>
                      </div>
                    </div>

                    <button
                      className="pec-connect-btn"
                      onClick={() => handleConnectWithPerson(person)}
                    >
                      <span>Connect & Message</span>
                      <span>→</span>
                    </button>
                  </div>
                )
              })}
            </div>
          </main>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODAL 1: CONCIERGE CALL SIMULATION MODAL
        ═════════════════════════════════════════════════════════════ */}
        {showCallModal && (
          <div className="custom-modal-backdrop" onClick={() => setShowCallModal(false)}>
            <div className="call-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="call-avatar-pulse">
                <img src={activeContact.avatar} alt={activeContact.name} className="call-avatar-img" />
              </div>

              <span className="call-badge-status">SECURE CONCIERGE VOICE LINK</span>
              <h3 className="call-contact-name">{activeContact.name}</h3>
              <p className="call-contact-role">{activeContact.role}</p>

              <div className="call-wave-visualizer">
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
              </div>

              <span className="call-timer-display">{formatCallTimer(callDuration)}</span>

              <div className="call-actions-row">
                <button className="call-end-btn" onClick={() => setShowCallModal(false)}>
                  <span>End Private Call</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODAL 2: CONTACT & ITINERARY DOSSIER MODAL
        ═════════════════════════════════════════════════════════════ */}
        {showDossierModal && (
          <div className="custom-modal-backdrop" onClick={() => setShowDossierModal(false)}>
            <div className="custom-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="cm-header">
                <div>
                  <span className="cm-badge-ai" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <ShieldIcon size={12} color="#D4A843" /> VERIFIED YATRAWAY PROFILE
                  </span>
                  <h3 className="cm-title">{activeContact.name}</h3>
                </div>
                <button className="cm-close" onClick={() => setShowDossierModal(false)}>✕</button>
              </div>

              <div className="dossier-modal-body">
                <div className="dossier-hero-row">
                  <img src={activeContact.avatar} alt={activeContact.name} className="dossier-avatar" />
                  <div>
                    <span className="dossier-badge-pill">{activeContact.badge}</span>
                    <h4 className="dossier-name">{activeContact.name}</h4>
                    <p className="dossier-role">{activeContact.role}</p>
                    <span className="dossier-status-text">
                      {activeContact.online ? '● Active in Bali/IST Zone' : '○ Verified Guide Available on Request'}
                    </span>
                  </div>
                </div>

                <div className="dossier-info-grid">
                  <div className="dig-col">
                    <span className="dig-lbl">SERVICE PROTOCOL</span>
                    <span className="dig-val">24/7 Priority Concierge & Itinerary Assistance</span>
                  </div>
                  <div className="dig-col">
                    <span className="dig-lbl">SECURITY CLEARANCE</span>
                    <span className="dig-val">Government Verified & Solo-Safe Certified</span>
                  </div>
                </div>

                <button
                  className="dossier-action-btn"
                  onClick={() => setShowDossierModal(false)}
                >
                  Return to Active Chat →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
