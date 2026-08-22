import { useState, useEffect } from 'react'

/**
 * useDebounce — delays a value update by the given ms
 * Checklist: Custom Hook #1
 */
export function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
