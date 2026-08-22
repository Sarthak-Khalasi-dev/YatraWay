import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthCtx = createContext({})

/* ── tiny password "hash" (XOR-based, fine for localStorage demo) ── */
function hashPassword(pw) {
  return btoa(unescape(encodeURIComponent(pw + '_wl_salt_2024')))
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const SESSION_KEY  = 'wl_session'
const USERS_KEY    = 'wl_users'
const SESSION_TTL  = 7 * 24 * 60 * 60 * 1000 // 7 days

/* ── Default seed data for demo ── */
const DEFAULT_USER = {
  id: 'demo_user_1',
  name: 'Ananya Sharma',
  email: 'ananya@example.com',
  passwordHash: hashPassword('password123'),
  avatar: 'https://picsum.photos/seed/portrait/160/160',
  bio: 'Adventure seeker obsessed with sunsets, street food, and stories from the road.',
  location: 'Bangalore, India',
  createdAt: new Date('2022-01-15').toISOString(),
}

function getUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    const users = stored ? JSON.parse(stored) : []
    // Seed default user if none
    if (users.length === 0) {
      const seeded = [DEFAULT_USER]
      localStorage.setItem(USERS_KEY, JSON.stringify(seeded))
      return seeded
    }
    return users
  } catch { return [] }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getSession() {
  try {
    const s = localStorage.getItem(SESSION_KEY)
    if (!s) return null
    const session = JSON.parse(s)
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch { return null }
}

function saveSession(userId) {
  const session = {
    userId,
    token: generateId(),
    expiresAt: Date.now() + SESSION_TTL,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  /* ── Restore session on mount ── */
  useEffect(() => {
    const session = getSession()
    if (session) {
      const users = getUsers()
      const user = users.find(u => u.id === session.userId)
      if (user) setCurrentUser(user)
    }
    setLoading(false)
  }, [])

  /* ── LOGIN ── */
  const login = useCallback((email, password) => {
    const users = getUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) return { success: false, error: 'No account found with this email.' }
    if (user.passwordHash !== hashPassword(password)) {
      return { success: false, error: 'Incorrect password. Please try again.' }
    }
    saveSession(user.id)
    setCurrentUser(user)
    return { success: true }
  }, [])

  /* ── REGISTER ── */
  const register = useCallback((name, email, password) => {
    const users = getUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' }
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' }
    }
    const newUser = {
      id: generateId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      avatar: `https://picsum.photos/seed/${generateId()}/160/160`,
      bio: '',
      location: '',
      createdAt: new Date().toISOString(),
    }
    saveUsers([...users, newUser])
    saveSession(newUser.id)
    setCurrentUser(newUser)
    return { success: true }
  }, [])

  /* ── LOGOUT ── */
  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setCurrentUser(null)
  }, [])

  /* ── UPDATE PROFILE ── */
  const updateProfile = useCallback((updates) => {
    const users = getUsers()
    const idx = users.findIndex(u => u.id === currentUser?.id)
    if (idx === -1) return
    const updated = { ...users[idx], ...updates }
    users[idx] = updated
    saveUsers(users)
    setCurrentUser(updated)
    return updated
  }, [currentUser])

  return (
    <AuthCtx.Provider value={{ currentUser, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
