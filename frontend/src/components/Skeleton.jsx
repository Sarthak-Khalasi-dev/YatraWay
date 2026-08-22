/**
 * Skeleton loader components
 * Checklist: Skeleton loaders / UX enhancements
 * Usage: <SkeletonCard /> or <SkeletonText lines={3} />
 */
import './Skeleton.css'

export function SkeletonCard() {
  return (
    <div className="sk-card">
      <div className="sk-img sk-pulse" />
      <div className="sk-body">
        <div className="sk-line sk-pulse" style={{ width: '65%' }} />
        <div className="sk-line sk-pulse" style={{ width: '40%' }} />
        <div className="sk-line sk-pulse" style={{ width: '80%', marginTop: 12 }} />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="sk-text-block">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="sk-line sk-pulse"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="sk-row">
      <div className="sk-avatar sk-pulse" />
      <div className="sk-row-lines">
        <div className="sk-line sk-pulse" style={{ width: '50%' }} />
        <div className="sk-line sk-pulse" style={{ width: '35%' }} />
      </div>
    </div>
  )
}
