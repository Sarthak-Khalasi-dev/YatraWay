/**
 * Basic Analytics Service
 * Checklist: Analytics & Tracking #16
 */

export const trackEvent = (category, action, label = null) => {
  // In production, this would send data to Google Analytics or similar
  console.log(`[Analytics] ${category} - ${action}${label ? ` : ${label}` : ''}`);
  
  // Example of storing in session storage for tracking
  const logs = JSON.parse(sessionStorage.getItem('analytics_logs') || '[]');
  logs.push({ category, action, label, timestamp: new Date().toISOString() });
  sessionStorage.setItem('analytics_logs', JSON.stringify(logs.slice(-20))); // Keep last 20
};

export const trackPageView = (path) => {
  console.log(`[Analytics] Page View: ${path}`);
  trackEvent('Navigation', 'Page View', path);
};
