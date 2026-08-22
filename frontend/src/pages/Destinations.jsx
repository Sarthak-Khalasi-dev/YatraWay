import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import api from '../services/api'
import { SparkleIcon, IndiaIcon, MountainIcon, WaveIcon, MonumentIcon, LeafIcon, GlobeIcon, CalendarIcon, ShieldIcon, CompassIcon, MapPinIcon } from '../components/icons/LuxuryIcons'
import './Destinations.css'

/* ── Animation Variants ── */
const staggerGrid = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
}
const cardEnter = {
  initial: { opacity: 0, y: 28, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 310, damping: 25 } },
  exit:    { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.18 } },
}
const spotlightEnter = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.22 } },
}

// ── Comprehensive Curated Destinations (Heavy India Focus + World Classics) ──
const INITIAL_DESTINATIONS = [
  // 🇮🇳 INDIA DESTINATIONS (Curated & Attractive High-Res Photos)
  {
    id: 'ladakh-expedition',
    name: 'Ladakh High-Pass & Pangong Oasis',
    country: 'India',
    region: 'Leh-Ladakh, Himalayas',
    isIndia: true,
    priceINR: 45000,
    priceUSD: 530,
    tag: 'ADVENTURE',
    category: 'Mountains',
    rating: 4.9,
    reviews: '2.8k',
    description: 'Traverse world’s highest motorable passes, discover ancient Tibetan monasteries, and sleep under millions of stars beside azure Pangong Lake.',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Hiking & Trekking', 'Museums & Art'],
    duration: '8 Days / 7 Nights',
    safetyScore: '9.8 / 10 (Solo/Women Safe)',
    bestSeason: 'May to October',
    highlights: ['Khardung La & Nubra Valley', 'Pangong Tso Lakeside Stays', 'Thiksey Monastery Sunrise Chants', 'Certified Women Alpine Guides'],
  },
  {
    id: 'kerala-backwaters',
    name: 'Kerala Backwaters & Munnar Mist',
    country: 'India',
    region: 'Alleppey & Munnar, Kerala',
    isIndia: true,
    priceINR: 38000,
    priceUSD: 450,
    tag: 'WELLNESS',
    category: 'Wellness',
    rating: 5.0,
    reviews: '3.4k',
    description: 'Drift through serene palm-canopied lagoons on private luxury houseboats, stroll fragrant tea estates in Munnar, and experience authentic Ayurvedic rejuvenation.',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Water Sports', 'Museums & Art'],
    duration: '6 Days / 5 Nights',
    safetyScore: '9.9 / 10 (Solo/Women Safe)',
    bestSeason: 'October to March',
    highlights: ['Private Solar Houseboat Cruise', 'Organic Tea Factory & Tasting', 'Daily Panchakarma & Yoga', 'Kathakali & Kalaripayattu Show'],
  },
  {
    id: 'udaipur-heritage',
    name: 'Udaipur Royal Palaces & Mewar Royalty',
    country: 'India',
    region: 'Udaipur, Rajasthan',
    isIndia: true,
    priceINR: 42000,
    priceUSD: 495,
    tag: 'HERITAGE',
    category: 'Heritage',
    rating: 4.9,
    reviews: '2.1k',
    description: 'Immerse in the romance of the City of Lakes with private heritage haveli suites, sunset boat rides on Lake Pichola, and royal Rajputana dining.',
    img: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Museums & Art'],
    duration: '5 Days / 4 Nights',
    safetyScore: '9.7 / 10',
    bestSeason: 'September to March',
    highlights: ['City Palace Private Courtyard Tour', 'Lake Pichola Sunset Yacht', 'Bagore Ki Haveli Folk Performance', 'Vintage Car Museum Access'],
  },
  {
    id: 'spiti-valley',
    name: 'Spiti Valley Celestial Stargazing Trail',
    country: 'India',
    region: 'Himachal Pradesh',
    isIndia: true,
    priceINR: 36000,
    priceUSD: 425,
    tag: 'ADVENTURE',
    category: 'Mountains',
    rating: 4.9,
    reviews: '1.6k',
    description: 'Explore the mystical middle land between Tibet and India. Visit 1,000-year-old Key Monastery, the world’s highest post office in Hikkim, and the sparkling Chandratal Lake.',
    img: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Hiking & Trekking'],
    duration: '7 Days / 6 Nights',
    safetyScore: '9.7 / 10',
    bestSeason: 'June to October',
    highlights: ['Key Gompa & Dhankar Monastery', 'Chandratal Crescent Moon Lake Camp', 'Hikkim World’s Highest Post Office', 'Milky Way Astrophotography'],
  },
  {
    id: 'meghalaya-roots',
    name: 'Meghalaya Living Roots & Azure Rivers',
    country: 'India',
    region: 'Cherrapunji & Dawki, Meghalaya',
    isIndia: true,
    priceINR: 39000,
    priceUSD: 460,
    tag: 'ADVENTURE',
    category: 'Nature',
    rating: 5.0,
    reviews: '1.9k',
    description: 'Trek ancient bio-engineered Double Decker Living Root Bridges, swim in natural turquoise limestone pools, and kayak on the glass-like waters of Umngot River.',
    img: 'https://images.unsplash.com/photo-1626014303757-646633783a30?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Hiking & Trekking', 'Water Sports'],
    duration: '6 Days / 5 Nights',
    safetyScore: '9.9 / 10 (Matrilineal Culture Safe)',
    bestSeason: 'October to May',
    highlights: ['Double Decker Root Bridge Hike', 'Dawki Transparent River Kayak', 'Nohkalikai Falls Observation', 'Mawlynnong Village Heritage Walk'],
  },
  {
    id: 'andaman-coral',
    name: 'Andaman Turquoise Reefs & Havelock Island',
    country: 'India',
    region: 'Andaman & Nicobar Islands',
    isIndia: true,
    priceINR: 65000,
    priceUSD: 765,
    tag: 'COASTAL',
    category: 'Beaches',
    rating: 4.8,
    reviews: '2.5k',
    description: 'Pristine white sands of Radhanagar Beach, night bioluminescent kayaking, scuba diving among vibrant coral gardens, and luxury private beach cabanas.',
    img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Water Sports'],
    duration: '6 Days / 5 Nights',
    safetyScore: '9.8 / 10',
    bestSeason: 'November to May',
    highlights: ['Bioluminescence Night Kayaking', 'PADI Certified Scuba Diving', 'Elephant Beach Coral Snorkeling', 'Radhanagar Sunset Lounge'],
  },
  {
    id: 'rishikesh-quest',
    name: 'Rishikesh Yogic Flow & White-Water Rapids',
    country: 'India',
    region: 'Uttarakhand, Foothills of Himalayas',
    isIndia: true,
    priceINR: 24000,
    priceUSD: 280,
    tag: 'ADVENTURE',
    category: 'Wellness',
    rating: 4.9,
    reviews: '3.1k',
    description: 'Find inner balance with world-renowned yoga ashrams, sunset Ganga Aarti rituals at Parmarth Niketan, and thrilling Grade-IV white-water rafting.',
    img: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Water Sports', 'Hiking & Trekking'],
    duration: '4 Days / 3 Nights',
    safetyScore: '9.9 / 10',
    bestSeason: 'September to June',
    highlights: ['Ganga Aarti at Triveni Ghat', '24km Grade-IV River Rafting', 'Beatles Ashram Meditation Trail', 'Waterfall Cliff Jumps'],
  },
  {
    id: 'kashmir-great-lakes',
    name: 'Kashmir Valley & Great Lakes Alpine Trek',
    country: 'India',
    region: 'Srinagar & Sonamarg, Kashmir',
    isIndia: true,
    priceINR: 48000,
    priceUSD: 565,
    tag: 'ADVENTURE',
    category: 'Mountains',
    rating: 4.9,
    reviews: '1.8k',
    description: 'Paradise on Earth: Luxury cedar houseboats on Dal Lake, Shikara floating flower markets, and panoramic high-altitude alpine lake expeditions in Sonamarg.',
    img: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Hiking & Trekking', 'Water Sports'],
    duration: '7 Days / 6 Nights',
    safetyScore: '9.5 / 10',
    bestSeason: 'April to October',
    highlights: ['Dal Lake Heritage Wood Houseboat', 'Floating Market Sunrise Shikara', 'Gulmarg Gondola World’s 2nd Highest', 'Sonamarg Thajiwas Glacier Walk'],
  },
  {
    id: 'hampi-ruins',
    name: 'Hampi Vijayanagara Empire & Boulder Valley',
    country: 'India',
    region: 'Karnataka, India',
    isIndia: true,
    priceINR: 22000,
    priceUSD: 260,
    tag: 'HERITAGE',
    category: 'Heritage',
    rating: 4.8,
    reviews: '1.5k',
    description: 'Step back in time to the 14th-century Vijayanagara capital. Marvel at the stone chariot of Vittala Temple, climb Matanga Hill for sunrise, and cruise in round coracles.',
    img: 'https://images.unsplash.com/photo-1600100397608-f010f4448554?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Museums & Art', 'Hiking & Trekking'],
    duration: '4 Days / 3 Nights',
    safetyScore: '9.7 / 10',
    bestSeason: 'October to March',
    highlights: ['Vittala Temple Musical Pillars', 'Matanga Hill 360° Sunrise', 'Tungabhadra Coracle Boat Ride', 'Hippie Island Sunset Bouldering'],
  },
  {
    id: 'jaisalmer-desert',
    name: 'Jaisalmer Golden Fort & Thar Desert Dunes',
    country: 'India',
    region: 'Thar Desert, Rajasthan',
    isIndia: true,
    priceINR: 34000,
    priceUSD: 400,
    tag: 'HERITAGE',
    category: 'Heritage',
    rating: 4.9,
    reviews: '2.0k',
    description: 'Camp in luxury Swiss tents amidst rolling golden dunes of Sam, take camel caravan sunset treks, and explore India’s only living golden sandstone fort.',
    img: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Museums & Art', 'Hiking & Trekking'],
    duration: '5 Days / 4 Nights',
    safetyScore: '9.6 / 10',
    bestSeason: 'October to March',
    highlights: ['Sam Sand Dunes Camel Safari', 'Desert Stargazing & Folk Music', 'Sonar Qila Living Fort Walk', 'Patwon Ki Haveli Architecture'],
  },
  {
    id: 'varanasi-spiritual',
    name: 'Varanasi Sacred Ghats & Silk Trail',
    country: 'India',
    region: 'Uttar Pradesh, India',
    isIndia: true,
    priceINR: 21000,
    priceUSD: 250,
    tag: 'CULTURE',
    category: 'Heritage',
    rating: 4.9,
    reviews: '3.8k',
    description: 'One of the oldest living cities in human civilization. Witness mystical Dashashwamedh Ghat Ganga Aarti by boat, navigate ancient alleys, and taste royal Banarasi paan.',
    img: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Museums & Art'],
    duration: '4 Days / 3 Nights',
    safetyScore: '9.6 / 10',
    bestSeason: 'October to March',
    highlights: ['Dawn Boat Ride across 84 Ghats', 'Grand Evening Maha Aarti', 'Sarnath Buddhist Enlightenment Tour', 'Master Weavers Banarasi Silk Hub'],
  },
  {
    id: 'gokarna-coastal',
    name: 'Gokarna Bohemian Beach & Cliff Trek',
    country: 'India',
    region: 'Karnataka Coastal Belt',
    isIndia: true,
    priceINR: 18500,
    priceUSD: 220,
    tag: 'COASTAL',
    category: 'Beaches',
    rating: 4.8,
    reviews: '2.2k',
    description: 'The peaceful, soulful alternative to crowded party beaches. Trek across cliff paths connecting Om Beach, Half Moon Beach, and Paradise Beach.',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Hiking & Trekking', 'Water Sports'],
    duration: '4 Days / 3 Nights',
    safetyScore: '9.8 / 10 (Solo Traveler Hub)',
    bestSeason: 'October to April',
    highlights: ['5-Beach Coastal Cliff Hike', 'Dolphin Spotting Boat Ride', 'Mirjan Fort Heritage Exploration', 'Beachfront Sunset Cafes'],
  },

  // 🌍 WORLD CLASSICS
  {
    id: 'swiss-alps',
    name: 'Swiss Alps Expedition',
    country: 'Switzerland',
    region: 'Bernese Oberland',
    isIndia: false,
    priceINR: 357000,
    priceUSD: 4200,
    tag: 'ADVENTURE',
    category: 'Mountains',
    rating: 4.9,
    reviews: '1.2k',
    description: 'Summit the peaks of the Bernese Alps with expert alpine guides, scenic railway passes, and cozy chalet stays.',
    img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Hiking & Trekking'],
    duration: '7 Days / 6 Nights',
    safetyScore: '9.8 / 10',
    bestSeason: 'June to September',
    highlights: ['Matterhorn Vista Trek', 'Glacier Express Scenic Pass', 'Private Alpine Chalet', 'High-Altitude Safety Guide'],
  },
  {
    id: 'kyoto-heritage',
    name: 'Kyoto Heritage Trail',
    country: 'Japan',
    region: 'Kansai Region',
    isIndia: false,
    priceINR: 263500,
    priceUSD: 3100,
    tag: 'CULTURE',
    category: 'Heritage',
    rating: 5.0,
    reviews: '840',
    description: 'Private tea ceremonies, ancient zen shrines, bamboo forest walks, and authentic ryokan hospitality.',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Museums & Art'],
    duration: '6 Days / 5 Nights',
    safetyScore: '9.9 / 10',
    bestSeason: 'March - May & Oct - Nov',
    highlights: ['Fushimi Inari Sunrise Tour', 'Traditional Uji Tea Ceremony', 'Arashiyama Bamboo Grove', 'Michelin Kaiseki Dining'],
  },
  {
    id: 'serengeti-safari',
    name: 'Serengeti Sky Safari',
    country: 'Tanzania',
    region: 'Serengeti National Park',
    isIndia: false,
    priceINR: 493000,
    priceUSD: 5800,
    tag: 'ADVENTURE',
    category: 'Wildlife',
    rating: 4.8,
    reviews: '2.1k',
    description: 'Experience the Great Migration from luxury tented camps, hot air balloon sunrises, and private 4x4 game drives.',
    img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Hiking & Trekking'],
    duration: '8 Days / 7 Nights',
    safetyScore: '9.6 / 10',
    bestSeason: 'July to October',
    highlights: ['Sunrise Hot Air Balloon Flight', 'Big Five Game Tracking', 'Luxury Canvas Safari Camp', 'Maasai Cultural Walk'],
  },
  {
    id: 'amalfi-coast',
    name: 'Amalfi Coast Odyssey',
    country: 'Italy',
    region: 'Campania',
    isIndia: false,
    priceINR: 306000,
    priceUSD: 3600,
    tag: 'CULTURE',
    category: 'Beaches',
    rating: 4.9,
    reviews: '1.5k',
    description: 'Private cliffside villas, chartered boat tours to Capri, lemon grove walks, and Michelin-starred coastal dining.',
    img: 'https://images.unsplash.com/photo-1533104182429-4b31e8ae3e9e?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Water Sports', 'Museums & Art'],
    duration: '6 Days / 5 Nights',
    safetyScore: '9.7 / 10',
    bestSeason: 'May to September',
    highlights: ['Private Capri Yacht Charter', 'Positano Sunset Terraces', 'Ravello Villa Gardens', 'Limoncello Workshop'],
  },
  {
    id: 'patagonia-trek',
    name: 'Patagonia Wild Trek',
    country: 'Chile & Argentina',
    region: 'Torres del Paine',
    isIndia: false,
    priceINR: 408000,
    priceUSD: 4800,
    tag: 'ADVENTURE',
    category: 'Mountains',
    rating: 4.9,
    reviews: '980',
    description: 'Glacier navigation across Torres del Paine, eco-dome luxury lodges, and pristine sub-polar fjord exploration.',
    img: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Hiking & Trekking'],
    duration: '9 Days / 8 Nights',
    safetyScore: '9.7 / 10',
    bestSeason: 'November to March',
    highlights: ['Grey Glacier Kayaking', 'W-Trek French Valley', 'EcoCamp Dome Stays', 'Gaucho Ranch Barbecue'],
  },
  {
    id: 'santorini-haven',
    name: 'Santorini Sunset Haven',
    country: 'Greece',
    region: 'Cyclades Islands',
    isIndia: false,
    priceINR: 289000,
    priceUSD: 3400,
    tag: 'CULTURE',
    category: 'Beaches',
    rating: 4.8,
    reviews: '1.8k',
    description: 'Caldera-view cave suites, private sunset catamaran cruises, and ancient volcanic vineyard tastings.',
    img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=900&h=1100&q=85&auto=format&fit=crop',
    activities: ['Water Sports', 'Museums & Art'],
    duration: '5 Days / 4 Nights',
    safetyScore: '9.8 / 10',
    bestSeason: 'May to October',
    highlights: ['Oia Private Sunset Deck', 'Red Beach Catamaran Sail', 'Akrotiri Ruins Guided Walk', 'Volcanic Wine Tasting'],
  },
]

export default function Destinations() {
  const navigate = useNavigate()
  const location = useLocation()

  // ── Currency State (INR / USD) ──
  const [currency, setCurrency] = useState('INR') // Default INR as requested

  // ── Core Filters ──
  const [destList, setDestList] = useState(INITIAL_DESTINATIONS)
  const [search, setSearch] = useState(location.state?.search || '')

  useEffect(() => {
    if (location.state?.search) {
      setSearch(location.state.search)
    }
  }, [location.state])
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeTags, setActiveTags] = useState(['ADVENTURE', 'CULTURE', 'HERITAGE', 'WELLNESS', 'COASTAL'])
  const [budgetMax, setBudgetMax] = useState(150000) // in INR default
  const [activities, setActivities] = useState({
    'Hiking & Trekking': true,
    'Water Sports': true,
    'Museums & Art': true,
  })
  const [guestRating, setGuestRating] = useState('4.5+')
  const [sortOption, setSortOption] = useState('Recommended')
  const [liked, setLiked] = useState({})
  const [showAllJourneys, setShowAllJourneys] = useState(false)
  const [selectedModalDest, setSelectedModalDest] = useState(null)

  // ── YatraWay AI State ──
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiSpotlight, setAiSpotlight] = useState(null)
  const [aiSearchTag, setAiSearchTag] = useState('')
  const [chatHistory, setChatHistory] = useState([])

  // Format price helper according to chosen currency
  const formatPrice = (dest) => {
    if (currency === 'INR') {
      const val = dest.priceINR || Math.round(dest.priceUSD * 85)
      return `₹${val.toLocaleString('en-IN')}`
    } else {
      const val = dest.priceUSD || Math.round(dest.priceINR / 85)
      return `$${val.toLocaleString('en-US')}`
    }
  }

  // Toggle active filter tag
  const removeTag = (tag) => {
    setActiveTags((prev) => prev.filter((t) => t !== tag))
  }

  const toggleActivity = (act) => {
    setActivities((prev) => ({ ...prev, [act]: !prev[act] }))
  }

  const toggleHeart = (e, destId) => {
    e.stopPropagation()
    setLiked((prev) => ({ ...prev, [destId]: !prev[destId] }))
  }

  // ── YatraWay AI Destination Generator Handler ──
  const handleGenerateAI = async (e) => {
    e?.preventDefault()
    if (!aiPrompt.trim()) return

    const currentPrompt = aiPrompt.trim()
    setIsGeneratingAI(true)
    setAiError('')

    // Parse user input for metadata (days, people, budget)
    const daysMatch = currentPrompt.match(/(\d+)\s*(?:day|days|d|nights)/i)
    const peopleMatch = currentPrompt.match(/(\d+)\s*(?:people|person|traveler|travelers|guests|members)/i)
    const budgetMatch = currentPrompt.match(/(?:budget|rs|inr|₹|under|around)?\s*(\d{4,7})\s*(?:rs|rupees|inr|k)?/i)

    const parsedDays = daysMatch ? parseInt(daysMatch[1]) : 4
    const parsedPeople = peopleMatch ? parseInt(peopleMatch[1]) : 4
    const parsedBudget = budgetMatch ? parseInt(budgetMatch[1]) : (parsedDays * 12500)
    const perPerson = Math.round(parsedBudget / parsedPeople)

    // Add user message to conversation history
    const userMsg = { id: Date.now(), sender: 'user', text: currentPrompt }
    setChatHistory((prev) => [...prev, userMsg])

    try {
      const response = await api.post('/gemini/generate-destinations', {
        prompt: currentPrompt,
        count: 3,
      })

      if (response.data && response.data.destinations && response.data.destinations.length > 0) {
        const newDestinations = response.data.destinations.map((d, index) => ({
          ...d,
          isIndia: d.country?.toLowerCase() === 'india' || true,
          priceINR: index === 0 ? perPerson : (d.priceInINR || 35000),
          priceUSD: index === 0 ? Math.round(perPerson / 85) : (d.priceInUSD || 420),
          totalBudgetINR: parsedBudget,
          peopleCount: parsedPeople,
          daysCount: parsedDays,
          isAiGenerated: true,
        }))

        const primarySpotlight = newDestinations[0]
        setAiSpotlight(primarySpotlight)
        setAiSearchTag(currentPrompt)
        setDestList((prev) => [...newDestinations, ...prev.filter((p) => !newDestinations.some((n) => n.id === p.id))])
        
        // Add AI response to chat history
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: `I have curated a personalized ${parsedDays}-day royal escape for ${parsedPeople} travelers with a total budget of ₹${parsedBudget.toLocaleString('en-IN')} (~₹${perPerson.toLocaleString('en-IN')}/person). Review your tailored spotlight itinerary below, or refine your plan directly in our interactive customizer.`,
        }
        setChatHistory((prev) => [...prev, aiMsg])
        setAiPrompt('')
        setShowAllJourneys(true)

        setTimeout(() => {
          document.querySelector('.ai-spotlight-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    } catch (err) {
      console.error('Groq AI error:', err)
      setAiError('Unable to generate with AI. Fallback loaded.')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // ── Filter & Search Logic ──
  const filtered = useMemo(() => {
    return destList.filter((item) => {
      // 1. Search Query
      if (search.trim()) {
        const query = search.toLowerCase()
        const match =
          item.name.toLowerCase().includes(query) ||
          item.country.toLowerCase().includes(query) ||
          item.region.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        if (!match) return false
      }

      // 2. Category Tab
      if (activeCategory === 'India') {
        if (!item.isIndia) return false
      } else if (activeCategory === 'Mountains') {
        if (item.category !== 'Mountains' && !item.activities?.includes('Hiking & Trekking')) return false
      } else if (activeCategory === 'Beaches') {
        if (item.category !== 'Beaches' && item.tag !== 'COASTAL') return false
      } else if (activeCategory === 'Heritage') {
        if (item.category !== 'Heritage' && item.tag !== 'HERITAGE') return false
      } else if (activeCategory === 'Wellness') {
        if (item.category !== 'Wellness' && item.tag !== 'WELLNESS') return false
      } else if (activeCategory === 'Global') {
        if (item.isIndia) return false
      }

      // 3. Active Filter Tags
      if (activeTags.length > 0) {
        if (!activeTags.includes(item.tag)) return false
      }

      // 4. Budget Range (Evaluated in INR)
      const currentPriceINR = item.priceINR || item.priceUSD * 85
      if (currency === 'INR') {
        if (currentPriceINR > budgetMax) return false
      } else {
        const budgetMaxUSD = budgetMax / 85
        if (item.priceUSD > budgetMaxUSD) return false
      }

      // 5. Guest Rating
      if (guestRating === '4.0+' && item.rating < 4.0) return false
      if (guestRating === '4.5+' && item.rating < 4.5) return false
      if (guestRating === '5.0' && item.rating < 5.0) return false

      return true
    }).sort((a, b) => {
      const priceA = a.priceINR || a.priceUSD * 85
      const priceB = b.priceINR || b.priceUSD * 85
      if (sortOption === 'Price: Low to High') return priceA - priceB
      if (sortOption === 'Price: High to Low') return priceB - priceA
      if (sortOption === 'Highest Rated') return b.rating - a.rating
      return 0 // Recommended
    })
  }, [destList, search, activeCategory, activeTags, budgetMax, currency, guestRating, sortOption])

  // Visible card slices (initial 6 or all)
  const visibleDestinations = showAllJourneys ? filtered : filtered.slice(0, 6)

  const handlePlanJourney = (dest) => {
    navigate('/trips', {
      state: {
        initialDest: dest.name,
        initialImg: dest.img,
        initialBudget: dest.totalBudgetINR || (dest.priceINR ? dest.priceINR * (dest.peopleCount || 1) : 50000),
        initialDays: dest.daysCount || 4,
        initialPeople: dest.peopleCount || 4,
        initialDesc: dest.description,
        autoOpenCustomizer: true,
      },
    })
  }

  return (
    <div className="dest-root">
      {/* Sidebar Navigation */}
      <Sidebar />

      <div className="dest-container">
        {/* Top Header Bar */}
        <header className="dest-topbar">
          <div className="dest-topbar-left">
            <h2 className="dest-topbar-title">Search Escapes</h2>
            <span className="dest-topbar-count">({filtered.length} journeys available)</span>
          </div>

          <div className="dest-topbar-right">
            {/* Currency Switcher (INR ⇄ USD) */}
            <div className="dest-currency-toggle" title="Switch Display Currency">
              <button
                className={`currency-btn ${currency === 'INR' ? 'active' : ''}`}
                onClick={() => {
                  setCurrency('INR')
                  setBudgetMax(150000)
                }}
              >
                ₹ INR
              </button>
              <button
                className={`currency-btn ${currency === 'USD' ? 'active' : ''}`}
                onClick={() => {
                  setCurrency('USD')
                  setBudgetMax(4500 * 85)
                }}
              >
                $ USD
              </button>
            </div>

            {/* Pill Search Bar */}
            <div className="dest-search-pill">
              <svg
                className="dest-search-icon"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8A8275"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="dest-search-input"
                placeholder="Search Ladakh, Kerala, Swiss..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="dest-search-clear" onClick={() => setSearch('')}>
                  ✕
                </button>
              )}
            </div>

            {/* Notifications & Saved */}
            <button className="dest-icon-btn" title="Saved Escapes" onClick={() => navigate('/favorites')}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>

            {/* User Profile */}
            <div className="dest-avatar-circle" onClick={() => navigate('/profile')} title="My Profile">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&q=80&auto=format&fit=crop"
                alt="User"
                className="dest-avatar-img"
              />
            </div>
          </div>
        </header>

        {/* Content Scrollable Area */}
        <div className="dest-content-scroll">
          {/* ── AI PROMPT BANNER (Powered by Groq AI) ── */}
          <div className={`ai-gemini-banner ${chatHistory.length > 0 ? 'chat-mode' : ''}`}>
            {chatHistory.length === 0 ? (
              <>
                <div className="ai-banner-left">
                  <div className="ai-badge">✨ YATRAWAY AI TRAVEL CURATOR</div>
                  <h3 className="ai-banner-title">Describe your dream journey in India or worldwide</h3>
                  <p className="ai-banner-sub">
                    Ask YatraWay AI to generate personalized, safe solo or group escapes with pricing in {currency}, certified homestays, and curated itineraries.
                  </p>
                </div>

                <form className="ai-banner-form" onSubmit={handleGenerateAI}>
                  <div className="ai-input-wrap">
                    <input
                      type="text"
                      className="ai-banner-input"
                      placeholder="e.g., Jaipur for 4 days, 4 people, budget 50000rs..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      disabled={isGeneratingAI}
                    />
                    <button type="submit" className="ai-banner-submit" disabled={isGeneratingAI || !aiPrompt.trim()}>
                      {isGeneratingAI ? (
                        <span className="ai-loading-spinner"></span>
                      ) : (
                        <span>GENERATE WITH AI →</span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="ai-chat-thread-container">
                <div className="ai-chat-header">
                  <span className="ai-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <SparkleIcon size={12} color="#D4A843" /> CONCIERGE TRAVEL ASSISTANT
                  </span>
                  <button
                    className="ai-chat-reset-btn"
                    onClick={() => {
                      setChatHistory([])
                      setAiSpotlight(null)
                      setAiSearchTag('')
                    }}
                  >
                    + New Plan
                  </button>
                </div>

                <div className="ai-chat-messages">
                  {chatHistory.map((msg) => (
                    <div key={msg.id} className={`ai-chat-bubble ${msg.sender}`}>
                      <span className="chat-bubble-sender">
                        {msg.sender === 'user' ? 'YOU' : 'YATRAWAY AI CONCIERGE'}
                      </span>
                      <p className="chat-bubble-text">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form className="ai-banner-form" onSubmit={handleGenerateAI}>
                  <div className="ai-input-wrap">
                    <input
                      type="text"
                      className="ai-banner-input"
                      placeholder="Ask to refine (e.g. 'Add hot air ballooning', 'Change budget to ₹40k', 'Include 5-star palace stay')..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      disabled={isGeneratingAI}
                    />
                    <button type="submit" className="ai-banner-submit" disabled={isGeneratingAI || !aiPrompt.trim()}>
                      {isGeneratingAI ? (
                        <span className="ai-loading-spinner"></span>
                      ) : (
                        <span>REFINE WITH AI →</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ── QUICK REGION / CATEGORY TABS ── */}
          <div className="dest-category-tabs">
            {[
              { id: 'All', label: 'All Curated Escapes', icon: SparkleIcon },
              { id: 'India', label: 'Incredible India', icon: IndiaIcon },
              { id: 'Mountains', label: 'Mountains & Treks', icon: MountainIcon },
              { id: 'Beaches', label: 'Beaches & Coastal', icon: WaveIcon },
              { id: 'Heritage', label: 'Royal Heritage', icon: MonumentIcon },
              { id: 'Wellness', label: 'Wellness & Nature', icon: LeafIcon },
              { id: 'Global', label: 'Global Classics', icon: GlobeIcon },
            ].map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  className={`dest-cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  {Icon && <Icon size={15} color="currentColor" />}
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>

          {/* ── 2-COLUMN MAIN LAYOUT ── */}
          <div className="dest-layout-grid">
            {/* ── LEFT COLUMN: REFINE SEARCH ── */}
            <aside className="refine-panel">
              <h3 className="refine-title">Refine Search</h3>

              {/* 1. Active Filters */}
              <div className="refine-section">
                <span className="refine-label">ACTIVE FILTERS</span>
                <div className="refine-tag-group">
                  {aiSearchTag && (
                    <button
                      className="refine-tag-pill"
                      style={{ borderColor: '#D4A843', background: 'rgba(212, 168, 67, 0.12)', color: '#D4A843' }}
                      onClick={() => {
                        setAiSpotlight(null)
                        setAiSearchTag('')
                      }}
                      title="Clear AI Prompt Filter"
                    >
                      <SparkleIcon size={12} color="#D4A843" />
                      <span>AI: {aiSearchTag.length > 18 ? aiSearchTag.substring(0, 18) + '...' : aiSearchTag}</span>
                      <span className="refine-tag-x">✕</span>
                    </button>
                  )}
                  {activeTags.map((tag) => (
                    <button key={tag} className="refine-tag-pill" onClick={() => removeTag(tag)}>
                      <span>{tag}</span>
                      <span className="refine-tag-x">✕</span>
                    </button>
                  ))}
                  {activeTags.length === 0 && !aiSearchTag && (
                    <button
                      className="refine-tag-reset"
                      onClick={() => setActiveTags(['ADVENTURE', 'CULTURE', 'HERITAGE', 'WELLNESS', 'COASTAL'])}
                    >
                      + Restore all filters
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Budget Range */}
              <div className="refine-section">
                <div className="refine-budget-row">
                  <span className="refine-label">BUDGET RANGE</span>
                  <span className="refine-budget-val">
                    {currency === 'INR'
                      ? `₹10,000 - ₹${budgetMax.toLocaleString('en-IN')}`
                      : `$120 - $${Math.round(budgetMax / 85).toLocaleString('en-US')}`}
                  </span>
                </div>
                <div className="refine-slider-wrapper">
                  <input
                    type="range"
                    min={currency === 'INR' ? 10000 : 120 * 85}
                    max={currency === 'INR' ? 500000 : 6000 * 85}
                    step={currency === 'INR' ? 5000 : 50 * 85}
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="refine-slider-input"
                  />
                  <div className="refine-slider-ticks">
                    <span>{currency === 'INR' ? '₹10k' : '$120'}</span>
                    <span>{currency === 'INR' ? '₹2.5L' : '$3k'}</span>
                    <span>{currency === 'INR' ? '₹5L+' : '$6k+'}</span>
                  </div>
                </div>
              </div>

              {/* 3. Activity Style */}
              <div className="refine-section">
                <span className="refine-label">ACTIVITY STYLE</span>
                <div className="refine-checkbox-list">
                  {Object.keys(activities).map((act) => {
                    const checked = activities[act]
                    return (
                      <label key={act} className="refine-check-item" onClick={() => toggleActivity(act)}>
                        <span className={`refine-custom-checkbox ${checked ? 'checked' : ''}`}>
                          {checked && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span className="refine-check-label">{act}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* 4. Guest Rating */}
              <div className="refine-section">
                <span className="refine-label">GUEST RATING</span>
                <div className="refine-rating-row">
                  {['4.0+', '4.5+', '5.0'].map((rate) => {
                    const isSelected = guestRating === rate
                    return (
                      <button
                        key={rate}
                        className={`refine-rating-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => setGuestRating(rate)}
                      >
                        {rate}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Apply Refinements Button */}
              <button
                className="refine-apply-btn"
                onClick={() => {
                  document.querySelector('.curated-header')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span>APPLY REFINEMENTS</span>
                <span className="refine-btn-arrow">→</span>
              </button>
            </aside>

            {/* ── RIGHT COLUMN: CURATED ESCAPES ── */}
            <main className="curated-main">
              {/* ── AI SPOTLIGHT HERO SHOWCASE (When AI generates tailored itinerary) ── */}
              <AnimatePresence>
              {aiSpotlight && (
                <motion.section className="ai-spotlight-card" variants={spotlightEnter} initial="initial" animate="animate" exit="exit">
                  <div className="asc-img-wrap">
                    <img src={aiSpotlight.img} alt={aiSpotlight.name} className="asc-img" />
                    <div className="asc-badge-floating">
                      <SparkleIcon size={12} color="#D4A843" />
                      <span>TAILORED AI CURATED ESCAPE</span>
                    </div>
                    <button
                      className="asc-close-btn"
                      onClick={() => {
                        setAiSpotlight(null)
                        setAiSearchTag('')
                      }}
                      title="Dismiss AI Spotlight"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="asc-content">
                    <div className="asc-header-row">
                      <div>
                        <span className="asc-loc-tag">
                          <MapPinIcon size={12} color="#D4A843" /> {aiSpotlight.region || aiSpotlight.country}, {aiSpotlight.country}
                        </span>
                        <h2 className="asc-title">{aiSpotlight.name}</h2>
                      </div>
                      <div className="asc-price-box">
                        <span className="asc-price-val">{formatPrice(aiSpotlight)}</span>
                        <span className="asc-price-sub">
                          {aiSpotlight.peopleCount
                            ? `/ traveler (₹${(aiSpotlight.totalBudgetINR || aiSpotlight.priceINR * aiSpotlight.peopleCount)?.toLocaleString('en-IN')} total for ${aiSpotlight.peopleCount} guests)`
                            : '/ traveler'}
                        </span>
                      </div>
                    </div>

                    <p className="asc-desc">{aiSpotlight.description}</p>

                    {aiSpotlight.highlights && aiSpotlight.highlights.length > 0 && (
                      <div className="asc-highlights-list">
                        <span className="asc-highlights-title">CURATED HIGHLIGHTS & LOCAL SECRETS</span>
                        <div className="asc-chips-row">
                          {aiSpotlight.highlights.map((h, i) => (
                            <span key={i} className="asc-highlight-chip">
                              • {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="asc-meta-row">
                      <span className="asc-meta-item">
                        <CalendarIcon size={13} color="#8C867A" /> {aiSpotlight.daysCount ? `${aiSpotlight.daysCount} Days / ${Math.max(1, aiSpotlight.daysCount - 1)} Nights` : (aiSpotlight.duration || '4 Days / 3 Nights')}
                      </span>
                      <span className="asc-meta-item">
                        <ShieldIcon size={13} color="#10B981" /> {aiSpotlight.safetyScore || '9.9/10 Solo & Group Safe'}
                      </span>
                      {aiSpotlight.bestSeason && (
                        <span className="asc-meta-item">
                          <CompassIcon size={13} color="#D4A843" /> Best: {aiSpotlight.bestSeason}
                        </span>
                      )}
                    </div>

                    <div className="asc-actions-row">
                      <button className="asc-btn-primary" onClick={() => handlePlanJourney(aiSpotlight)}>
                        <span>Customize Itinerary in Builder →</span>
                      </button>
                      <button className="asc-btn-secondary" onClick={() => setSelectedModalDest(aiSpotlight)}>
                        <span>Inspect Full Dossier</span>
                      </button>
                    </div>
                  </div>
                </motion.section>
              )}
              </AnimatePresence>

              {/* Header Title + Subtitle + Sort Dropdown */}
              <div className="curated-header">
                <div>
                  <h1 className="curated-heading">
                    {aiSpotlight ? 'More Curated Journeys & Escapes' : 'Curated Escapes'}
                  </h1>
                  <p className="curated-subheading">
                    Discovery awaits among our {filtered.length} chosen paths in India and worldwide.
                  </p>
                </div>

                {/* Sort Dropdown */}
                <div className="curated-sort-box">
                  <span className="curated-sort-label">SORT BY</span>
                  <select
                    className="curated-sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Highest Rated">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Destination Cards 3-Column Grid */}
              <motion.div
                className="curated-grid"
                variants={staggerGrid}
                initial="animate"
                animate="animate"
                key={activeCategory + activeTags.join('') + sortOption}
              >
                {visibleDestinations.map((dest) => {
                  const isHearted = liked[dest.id]
                  return (
                    <motion.article key={dest.id} className="escape-card" variants={cardEnter} whileHover={{ y: -7, scale: 1.015 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 340, damping: 22 }} onClick={() => setSelectedModalDest(dest)}>
                      {/* Image Frame */}
                      <div className="escape-img-container">
                        <img src={dest.img} alt={dest.name} className="escape-img" loading="lazy" />

                        {/* Top Left Tag Badge */}
                        <div className="escape-tag-badge">
                          <span>{dest.tag}</span>
                          {dest.isIndia && (
                            <span className="india-flag-badge" style={{ display: 'inline-flex', alignItems: 'center' }}>
                              <IndiaIcon size={12} color="#D4A843" />
                            </span>
                          )}
                        </div>

                        {/* Top Right Heart Icon */}
                        <button
                          className={`escape-heart-btn ${isHearted ? 'active' : ''}`}
                          onClick={(e) => toggleHeart(e, dest.id)}
                          aria-label="Save to favorites"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={isHearted ? '#DC2626' : 'none'}
                            stroke={isHearted ? '#DC2626' : '#262626'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>

                        {/* Bottom Left Rating Pill */}
                        <div className="escape-rating-pill">
                          <span className="escape-star">★</span>
                          <span className="escape-rating-num">{dest.rating}</span>
                          <span className="escape-rating-count">({dest.reviews})</span>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="escape-body">
                        {/* Title and Price Header */}
                        <div className="escape-title-row">
                          <div>
                            <h2 className="escape-title">{dest.name}</h2>
                            <p className="escape-location-sub">{dest.region}, {dest.country}</p>
                          </div>
                          <span className="escape-price">{formatPrice(dest)}</span>
                        </div>

                        {/* Description */}
                        <p className="escape-desc">{dest.description}</p>

                        {/* Safety & Duration Badge */}
                        <div className="escape-meta-tags">
                          <span className="escape-meta-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                            <CalendarIcon size={12} color="#8C867A" /> {dest.duration}
                          </span>
                          <span className="escape-meta-pill safe" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                            <ShieldIcon size={12} color="#10B981" /> {dest.safetyScore?.split(' ')[0]}
                          </span>
                        </div>

                        {/* View Details Button */}
                        <button
                          className="escape-details-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedModalDest(dest)
                          }}
                        >
                          <span>VIEW DETAILS</span>
                          <span className="escape-btn-arrow">→</span>
                        </button>
                      </div>
                    </motion.article>
                  )
                })}
              </motion.div>

              {/* No Results Fallback */}
              {filtered.length === 0 && (
                <div className="curated-empty-state">
                  <p className="curated-empty-text">No curated paths matched your current refinements.</p>
                  <button
                    className="curated-reset-btn"
                    onClick={() => {
                      setSearch('')
                      setActiveCategory('All')
                      setActiveTags(['ADVENTURE', 'CULTURE', 'HERITAGE', 'WELLNESS', 'COASTAL'])
                      setBudgetMax(150000)
                      setGuestRating('4.5+')
                    }}
                  >
                    RESET ALL REFINEMENTS
                  </button>
                </div>
              )}

              {/* Center Bottom: Explore More Journeys Button */}
              {filtered.length > 6 && (
                <div className="curated-footer-action">
                  <button
                    className="explore-more-btn"
                    onClick={() => setShowAllJourneys(!showAllJourneys)}
                  >
                    {showAllJourneys ? 'SHOW LESS JOURNEYS' : `EXPLORE ALL ${filtered.length} JOURNEYS`}
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* ── EXPEDITION DETAILS MODAL ── */}
      <AnimatePresence>
      {selectedModalDest && (
        <motion.div
          className="dest-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={() => setSelectedModalDest(null)}
        >
          <motion.div
            className="dest-modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="dest-modal-close" onClick={() => setSelectedModalDest(null)}>
              ✕
            </button>

            <div className="dest-modal-header-img">
              <img src={selectedModalDest.img} alt={selectedModalDest.name} />
              <div className="dest-modal-overlay">
                <div className="dest-modal-tags-row">
                  <span className="dest-modal-tag">{selectedModalDest.tag}</span>
                  {selectedModalDest.isIndia && (
                    <span className="dest-modal-tag india" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <IndiaIcon size={13} color="currentColor" /> INCREDIBLE INDIA
                    </span>
                  )}
                </div>
                <h3 className="dest-modal-title">{selectedModalDest.name}</h3>
                <p className="dest-modal-loc">{selectedModalDest.region}, {selectedModalDest.country}</p>
              </div>
            </div>

            <div className="dest-modal-body">
              <div className="dest-modal-meta-grid">
                <div className="dest-modal-meta-col">
                  <span className="dest-meta-label">INVESTMENT</span>
                  <span className="dest-meta-val">{formatPrice(selectedModalDest)} / traveler</span>
                </div>
                <div className="dest-modal-meta-col">
                  <span className="dest-meta-label">DURATION</span>
                  <span className="dest-meta-val">{selectedModalDest.duration}</span>
                </div>
                <div className="dest-modal-meta-col">
                  <span className="dest-meta-label">SAFETY RATING</span>
                  <span className="dest-meta-val" style={{ color: '#059669' }}>
                    🛡️ {selectedModalDest.safetyScore}
                  </span>
                </div>
                <div className="dest-modal-meta-col">
                  <span className="dest-meta-label">BEST SEASON</span>
                  <span className="dest-meta-val">🌤️ {selectedModalDest.bestSeason || 'Year Round'}</span>
                </div>
              </div>

              <div className="dest-modal-desc-sec">
                <h4>Expedition Overview</h4>
                <p>{selectedModalDest.description}</p>
              </div>

              <div className="dest-modal-highlights">
                <h4>Curated Inclusions & Highlights</h4>
                <ul>
                  {selectedModalDest.highlights?.map((h, i) => (
                    <li key={i}>
                      <span className="highlight-dot">✦</span> {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="dest-modal-actions">
                <button
                  className="dest-modal-plan-btn"
                  onClick={() => handlePlanJourney(selectedModalDest)}
                >
                  PLAN THIS ESCAPE IN MY TRIPS ({formatPrice(selectedModalDest)}) →
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}
