import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)

/* ── Toast item component ── */
function ToastItem({ toast, onRemove }) {
  const icons = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️',
    warning: '⚠️',
  }

  return (
    <div className={`toast toast--${toast.type}`} style={{ animationDelay: '0s' }}>
      <span className="toast-ico">{icons[toast.type] || icons.info}</span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={() => onRemove(toast.id)}>×</button>
    </div>
  )
}

/* ── Toast container ── */
export function ToastContainer() {
  const ctx = useContext(ToastCtx)
  if (!ctx) return null
  return (
    <div className="toast-container">
      {ctx.toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={ctx.remove} />
      ))}
    </div>
  )
}

/* ── Provider ── */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, type = 'info', duration = 3500) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), duration)
  }, [])

  const remove = useCallback((id) => {
    setToasts(p => p.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (msg) => add(msg, 'success'),
    error:   (msg) => add(msg, 'error'),
    info:    (msg) => add(msg, 'info'),
    warning: (msg) => add(msg, 'warning'),
  }

  return (
    <ToastCtx.Provider value={{ toasts, add, remove, toast }}>
      {children}
      <ToastContainer />
    </ToastCtx.Provider>
  )
}

/* ── Hook ── */
export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx.toast
}
