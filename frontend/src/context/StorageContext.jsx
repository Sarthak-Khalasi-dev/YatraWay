import { createContext, useContext, useCallback } from 'react'
import { useSelector } from 'react-redux'

const StorageCtx = createContext({})

/* ── Default seed data ── */
const DEFAULT_TRIPS = [
  {
    id: 'trip_1', dest: 'Bali, Indonesia', status: 'Upcoming',
    dates: '20 May — 02 Jun 2024', days: 12, daysLeft: 12,
    progress: 70, budget: '₹55,000', spent: '₹38,500',
    img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&h=400&q=80&auto=format&fit=crop',
    activities: ['Temple Tour', 'Surfing', 'Rice Terraces'], members: 2,
    notes: 'Book villa in Ubud. Check visa requirements.',
  },
  {
    id: 'trip_2', dest: 'Santorini, Greece', status: 'Upcoming',
    dates: '15 Jul — 25 Jul 2024', days: 10, daysLeft: 57,
    progress: 30, budget: '₹95,000', spent: '₹28,000',
    img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=400&q=80&auto=format&fit=crop',
    activities: ['Caldera View', 'Wine Tasting', 'Sailing'], members: 2,
    notes: '',
  },
  {
    id: 'trip_3', dest: 'Kyoto, Japan', status: 'Wishlist',
    dates: 'Sep 2024', days: 9, daysLeft: null,
    progress: 10, budget: '₹1,30,000', spent: '₹0',
    img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&q=80&auto=format&fit=crop',
    activities: ['Geisha District', 'Tea Ceremony', 'Bamboo Grove'], members: 1,
    notes: 'Cherry blossom season is April.',
  },
  {
    id: 'trip_4', dest: 'Goa, India', status: 'Completed',
    dates: '01 Jan — 07 Jan 2024', days: 7, daysLeft: null,
    progress: 100, budget: '₹25,000', spent: '₹23,400',
    img: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600&h=400&q=80&auto=format&fit=crop',
    activities: ['Beach Hopping', 'Nightlife', 'Water Sports'], members: 4,
    notes: '',
  },
  {
    id: 'trip_5', dest: 'Maldives', status: 'Completed',
    dates: '10 Mar — 17 Mar 2024', days: 7, daysLeft: null,
    progress: 100, budget: '₹1,20,000', spent: '₹1,14,000',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&q=80&auto=format&fit=crop',
    activities: ['Snorkeling', 'Overwater Villa', 'Sunset Cruise'], members: 2,
    notes: '',
  },
]

const DEFAULT_BOOKINGS = [
  {
    id: 'bk_1', type: 'Flights', title: 'BLR → DPS (Bali)',
    detail: 'IndiGo · 6E-1234 · Economy', date: '20 May 2024', time: '06:30 AM',
    status: 'Confirmed', price: '₹18,500', ref: 'IGO-2024-BLR-DPS',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&q=80&auto=format&fit=crop', icon: '✈️', duration: '5h 15m',
  },
  {
    id: 'bk_2', type: 'Hotels', title: 'Komaneka at Bisma',
    detail: 'Ubud, Bali · Deluxe Room · 2 Adults', date: '20 May — 02 Jun 2024', time: 'Check-in 2PM',
    status: 'Confirmed', price: '₹28,000', ref: 'KOM-2024-0520',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&q=80&auto=format&fit=crop', icon: '🏨', duration: '12 nights',
  },
  {
    id: 'bk_3', type: 'Activities', title: 'Ubud Monkey Forest Tour',
    detail: 'Guided Tour · 4 Hours · Pickup Included', date: '23 May 2024', time: '09:00 AM',
    status: 'Confirmed', price: '₹2,800', ref: 'ACT-2024-0523',
    img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&h=400&q=80&auto=format&fit=crop', icon: '🎯', duration: '4 hours',
  },
]

const DEFAULT_FAVORITES = [
  { id: 'fav_1', name: 'Maldives', country: 'South Asia', rating: 4.9, price: '₹1,20,000', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&q=80&auto=format&fit=crop', note: 'Dream honeymoon spot 🌴' },
  { id: 'fav_2', name: 'Swiss Alps', country: 'Switzerland', rating: 4.9, price: '₹1,50,000', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&q=80&auto=format&fit=crop', note: 'Winter skiing bucket list ⛷️' },
  { id: 'fav_3', name: 'Kyoto', country: 'Japan', rating: 4.9, price: '₹1,30,000', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&q=80&auto=format&fit=crop', note: 'Cherry blossom season 🌸' },
]

const DEFAULT_EMERGENCY_CONTACTS = [
  { id: 'ec_1', name: 'Rajesh Sharma', rel: 'Father', phone: '+91 98765 43210', initial: 'R' },
  { id: 'ec_2', name: 'Priya Patel', rel: 'Partner', phone: '+91 91234 56789', initial: 'P' },
]

/* ── Generic localStorage helpers ── */
function getKey(namespace, userId) {
  return `wl_${namespace}_${userId}`
}

/* ── Data versioning — bump when defaults change ── */
const DATA_VERSION = 'v5_final'
const VERSION_KEY  = 'wl_data_version'

function loadData(namespace, userId, defaults) {
  try {
    const key = getKey(namespace, userId)
    const storedVersion = localStorage.getItem(VERSION_KEY)
    if (storedVersion !== DATA_VERSION) {
      localStorage.removeItem(key)
      localStorage.setItem(VERSION_KEY, DATA_VERSION)
    }
    const stored = localStorage.getItem(key)
    if (stored) return JSON.parse(stored)
    localStorage.setItem(key, JSON.stringify(defaults))
    return defaults
  } catch { return defaults }
}

function saveData(namespace, userId, data) {
  try {
    localStorage.setItem(getKey(namespace, userId), JSON.stringify(data))
  } catch { /* quota exceeded */ }
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/* ── CRUD factory ── */
function useCRUD(namespace, userId, defaults) {
  const load = useCallback(() => {
    if (!userId) return []
    return loadData(namespace, userId, defaults)
  }, [namespace, userId, defaults])

  const getAll = useCallback(() => load(), [load])

  const add = useCallback((item) => {
    const items = load()
    const newItem = { ...item, id: generateId() }
    const updated = [...items, newItem]
    saveData(namespace, userId, updated)
    return newItem
  }, [load, namespace, userId])

  const update = useCallback((id, changes) => {
    const items = load()
    const updated = items.map(i => i.id === id ? { ...i, ...changes } : i)
    saveData(namespace, userId, updated)
    return updated.find(i => i.id === id)
  }, [load, namespace, userId])

  const remove = useCallback((id) => {
    const items = load()
    const updated = items.filter(i => i.id !== id)
    saveData(namespace, userId, updated)
  }, [load, namespace, userId])

  return { getAll, add, update, remove }
}

/* ── Provider ── */
export function StorageProvider({ children }) {
  const { userInfo } = useSelector((state) => state.auth)
  const userId = userInfo?._id

  const tripsStore    = useCRUD('trips',     userId, DEFAULT_TRIPS)
  const bookingsStore = useCRUD('bookings',  userId, DEFAULT_BOOKINGS)
  const favsStore     = useCRUD('favorites', userId, DEFAULT_FAVORITES)
  const emergencyStore= useCRUD('emergency', userId, DEFAULT_EMERGENCY_CONTACTS)

  return (
    <StorageCtx.Provider value={{ tripsStore, bookingsStore, favsStore, emergencyStore }}>
      {children}
    </StorageCtx.Provider>
  )
}

export const useStorage = () => useContext(StorageCtx)
