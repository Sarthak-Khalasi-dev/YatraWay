const IMG = (seed, w = 600, h = 400) => `https://picsum.photos/seed/${seed}/${w}/${h}`

export const TRIPS = [
  {
    id: 1,
    dest: 'Bali, Indonesia',
    dates: '20 May — 02 Jun 2024',
    days: 12,
    status: 'upcoming',
    daysLeft: 12,
    img: IMG('bali'),
    color: '#4DB6A9',
  },
  {
    id: 2,
    dest: 'Santorini, Greece',
    dates: '15 Jul — 25 Jul 2024',
    days: 10,
    status: 'planning',
    daysLeft: 57,
    img: IMG('santorini'),
    color: '#7B8FD4',
  },
  {
    id: 3,
    dest: 'Kyoto, Japan',
    dates: '03 Sep — 12 Sep 2024',
    days: 9,
    status: 'planning',
    daysLeft: 107,
    img: IMG('kyoto'),
    color: '#E07B7B',
  },
  {
    id: 4,
    dest: 'Patagonia, Argentina',
    dates: 'Nov 2024',
    days: 14,
    status: 'wishlist',
    daysLeft: null,
    img: IMG('patagonia'),
    color: '#82C485',
  },
]

export const STATS = [
  {
    label: 'Countries Visited',
    value: '24',
    img: IMG('globe', 120, 120),
    svgIcon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    change: '+3 this year',
    changeType: 'up',
  },
  {
    label: 'Trips Completed',
    value: '18',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&q=80&fit=crop',
    svgIcon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
        <rect x="9" y="11" width="14" height="10" rx="2"/>
      </svg>
    ),
    change: '+5 this year',
    changeType: 'up',
  },
  {
    label: 'Days Traveled',
    value: '312',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=80&fit=crop',
    svgIcon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    change: '28 days left',
    changeType: 'neutral',
  },
  {
    label: 'Miles Covered',
    value: '84k',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=120&q=80&fit=crop',
    svgIcon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </svg>
    ),
    change: '+12k this year',
    changeType: 'up',
  },
]

export const EXPLORE = [
  { name: 'Amalfi Coast', country: 'Italy', img: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=500&q=80&fit=crop', tag: 'Trending' },
  { name: 'Machu Picchu', country: 'Peru', img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500&q=80&fit=crop', tag: 'Bucket list' },
  { name: 'Maldives', country: 'South Asia', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&q=80&fit=crop', tag: 'Popular' },
]

export function statusLabel(status) {
  if (status === 'upcoming') return 'Upcoming'
  if (status === 'planning') return 'Planning'
  return 'Wishlist'
}
