import { useEffect } from 'react'

/**
 * usePageTitle — dynamically sets document.title per page
 * Checklist: SEO — dynamic page titles
 */
export function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} | YatraWay` : 'YatraWay — Travel Planning'
    return () => { document.title = prev }
  }, [title])
}
