import { useState, useEffect } from 'react'

/**
 * useLocalStorage — synced localStorage state hook
 * Checklist: localStorage utility + Custom Hook #3
 */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initial
    } catch { return initial }
  })

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) }
    catch { /* quota exceeded */ }
  }, [key, value])

  return [value, setValue]
}

/**
 * useSessionStorage — synced sessionStorage state hook
 * Checklist: sessionStorage utility
 */
export function useSessionStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = sessionStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initial
    } catch { return initial }
  })

  useEffect(() => {
    try { sessionStorage.setItem(key, JSON.stringify(value)) }
    catch { /* storage unavailable */ }
  }, [key, value])

  return [value, setValue]
}
