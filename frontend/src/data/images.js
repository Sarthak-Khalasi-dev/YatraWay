// ─── Central Image Registry ────────────────────────────────────────────
// Using a mix of verified-stable Unsplash IDs and Pexels CDN URLs

// Unsplash helper — only use IDs confirmed working
const U = (id, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`

// ── Destinations ──────────────────────────────────────────────────────
export const DEST_IMGS = {
  maldives:    U('1507525428034-b723cf961d3e', 600, 420),  // ✅ Maldives overwater bungalow
  santorini:   'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=420&q=80&auto=format&fit=crop', // Santorini verified 2023
  swissAlps:   U('1531366936337-7c912a4589a7', 600, 420),  // ✅ Swiss Alps
  bali:        U('1555400038-63f5ba517a47',   600, 420),   // ✅ Bali rice terraces
  machuPicchu: U('1587595431973-160d0d94add1', 600, 420),  // ✅ Machu Picchu
  kyoto:       U('1528360983277-13d401cdc186', 600, 420),  // ✅ Kyoto Japan
  serengeti:   U('1547471080-7cc2caa01a7e',   600, 420),   // ✅ Safari
  amalfi:      U('1496950866959-a49c4823e6bc', 600, 420),  // ✅ Amalfi coast
  patagonia:   U('1501854140801-50d01698950b', 600, 420),  // ✅ Patagonia
  newYork:     U('1534430480872-3498386e7856', 600, 420),  // ✅ NYC
  ladakh:      U('1506905925346-21bda4d32df4', 600, 420),  // ✅ Mountain lake
  queenstown:  U('1507608616759-54f48f0af0ee', 600, 420),  // ✅ Mountains
}

// ── Trip destinations ─────────────────────────────────────────────────
export const TRIP_IMGS = {
  bali:        U('1555400038-63f5ba517a47',   600, 420),
  santorini:   'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=420&q=80&auto=format&fit=crop',
  kyoto:       U('1528360983277-13d401cdc186', 600, 420),
  goa:         U('1506461883276-594a12b11cf3', 600, 420),
  swissAlps:   U('1531366936337-7c912a4589a7', 600, 420),
  maldives:    U('1507525428034-b723cf961d3e', 600, 420),
  switzerland: U('1506905925346-21bda4d32df4', 600, 420),
  thailand:    U('1528181304800-259b08848526', 600, 420),
}

// ── Experiences ───────────────────────────────────────────────────────
export const EXP_IMGS = {
  balloon:        U('1507608616759-54f48f0af0ee', 600, 420),
  spa:            U('1544161515-4be5df62b49f',   600, 420),
  scuba:          U('1510017803434-a899851a5373', 600, 420),
  pasta:          U('1555396273-367ea4eb4db5',   600, 420),
  northernLights: U('1531366936337-7c912a4589a7', 600, 420),
  sushi:          U('1617196034183-421b4040d20d', 600, 420),
}

// ── Dashboard hero ────────────────────────────────────────────────────
// Using a picsum scenic seed that reliably renders a travel-like landscape
export const HERO_IMG     = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&h=700&q=80&auto=format&fit=crop'
export const HERO_SMALL_A = U('1501854140801-50d01698950b', 300, 400)  // ✅ Patagonia
export const HERO_SMALL_B = U('1499856871958-5b9627545d1a', 300, 370)  // ✅ Paris night

// ── Recommended cards ─────────────────────────────────────────────────
export const REC_IMGS = {
  maldives:    U('1507525428034-b723cf961d3e', 600, 420),
  switzerland: U('1506905925346-21bda4d32df4', 600, 420),
  greece:      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=420&q=80&auto=format&fit=crop',
  bali:        U('1555400038-63f5ba517a47',   600, 420),
}

// ── Adventure section ─────────────────────────────────────────────────
export const ADV_MOUNTAIN  = U('1464822759023-fed622ff2c3b', 700, 440)
export const ADV_NIGHT_SKY = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&h=440&q=80&auto=format&fit=crop'

// ── Stat card thumbnails ──────────────────────────────────────────────
export const STAT_IMGS = [
  U('1488085061851-d92d5ca6ca58', 120, 120),
  U('1436491865332-7a61a109cc05', 120, 120),
  U('1506905925346-21bda4d32df4', 120, 120),
  U('1507608616759-54f48f0af0ee', 120, 120),
]

// ── Destinations hero banner ──────────────────────────────────────────
export const DEST_HERO = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&h=500&q=80&auto=format&fit=crop'

// ── Info strip — next trip thumb ─────────────────────────────────────
export const NEXT_TRIP_THUMB = U('1555400038-63f5ba517a47', 120, 120)

// ── Sidebar / user avatar ─────────────────────────────────────────────
export const AVATAR = U('1494790108377-be9c29b29330', 80, 80)

// ── Explore section ───────────────────────────────────────────────────
export const EXPLORE_IMGS = [
  U('1496950866959-a49c4823e6bc', 500, 380),
  U('1587595431973-160d0d94add1', 500, 380),
  U('1507525428034-b723cf961d3e', 500, 380),
]

// ── Login page ────────────────────────────────────────────────────────
export const LOGIN_BG    = U('1506905925346-21bda4d32df4', 1400, 900)
export const LOGIN_THUMB = U('1555400038-63f5ba517a47',   200,  200)
