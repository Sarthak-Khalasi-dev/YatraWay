import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'

const AuthCtx = createContext({})

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile or construct fallback user object
  const fetchProfile = useCallback(async (user) => {
    if (!user) return null

    let profileData = null
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!error && data) {
        profileData = data
      }
    } catch {
      // Fallback if profiles table is not created yet
    }

    return {
      id: user.id,
      email: user.email,
      name: profileData?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Explorer',
      avatar: profileData?.avatar_url || user.user_metadata?.avatar_url || 'https://picsum.photos/seed/portrait/160/160',
      createdAt: user.created_at,
    }
  }, [])

  // Listen to Supabase auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession)
      if (initSession?.user) {
        fetchProfile(initSession.user).then(u => setCurrentUser(u))
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        const u = await fetchProfile(newSession.user)
        setCurrentUser(u)
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  /* ── SIGN UP / REGISTER ── */
  const signUp = useCallback(async (name, email, password) => {
    let userName = name
    let userEmail = email
    let userPassword = password

    if (typeof name === 'object' && name !== null) {
      userEmail = name.email
      userPassword = name.password
      userName = name.options?.data?.full_name || name.name || ''
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userEmail,
        password: userPassword,
        options: {
          data: {
            full_name: userName,
          },
        },
      })

      if (error) return { success: false, error: error.message }
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed.' }
    }
  }, [])

  /* ── SIGN IN / LOGIN ── */
  const signIn = useCallback(async (email, password) => {
    let userEmail = email
    let userPassword = password

    if (typeof email === 'object' && email !== null) {
      userEmail = email.email
      userPassword = email.password
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      })

      if (error) return { success: false, error: error.message }
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed.' }
    }
  }, [])

  /* ── OAUTH SIGN IN (Google & Apple) ── */
  const signInWithOAuth = useCallback(async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) return { success: false, error: error.message }
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message || `${provider} login failed.` }
    }
  }, [])

  /* ── SIGN OUT / LOGOUT ── */
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setCurrentUser(null)
      setSession(null)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  /* ── UPDATE PROFILE ── */
  const updateProfile = useCallback(async (updates) => {
    if (!currentUser) return null
    try {
      if (updates.name) {
        await supabase.from('profiles').update({ full_name: updates.name }).eq('id', currentUser.id)
      }
      const updated = { ...currentUser, ...updates }
      setCurrentUser(updated)
      return updated
    } catch {
      return currentUser
    }
  }, [currentUser])

  return (
    <AuthCtx.Provider
      value={{
        currentUser,
        session,
        loading,
        signUp,
        signIn,
        signInWithOAuth,
        signOut,
        // Aliases for compatibility
        register: signUp,
        login: signIn,
        logout: signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
