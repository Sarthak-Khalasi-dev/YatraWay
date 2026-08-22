import { Component } from 'react'

/**
 * ErrorBoundary — catches unhandled React render errors
 * Checklist: Error Boundary
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/dashboard'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#F7F3EE', fontFamily: 'DM Sans, sans-serif', padding: 24,
          textAlign: 'center'
        }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: '#EF4444' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1C2B3A', marginBottom: 10 }}>
            Something went wrong
          </h1>
          <p style={{ color: '#7A8694', marginBottom: 24, maxWidth: 360, lineHeight: 1.6 }}>
            We ran into an unexpected error. Don't worry — your data is safe.
          </p>
          <code style={{
            display: 'block', background: '#f0ebe5', padding: '10px 18px',
            borderRadius: 8, fontSize: 12, color: '#555', maxWidth: 480,
            marginBottom: 28, wordBreak: 'break-all', textAlign: 'left'
          }}>
            {this.state.error?.message}
          </code>
          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 28px', background: '#1C2B3A', color: 'white',
              border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
