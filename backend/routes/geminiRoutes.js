const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

// High-definition curated image bank mapping for realistic fallbacks & AI styling
const PHOTO_MAP = {
  ladakh: 'https://images.unsplash.com/photo-1581791538302-03537b9c97bf?w=800&h=950&q=85&auto=format&fit=crop',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=950&q=85&auto=format&fit=crop',
  rajasthan: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=950&q=85&auto=format&fit=crop',
  udaipur: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&h=950&q=85&auto=format&fit=crop',
  spiti: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&h=950&q=85&auto=format&fit=crop',
  rishikesh: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=800&h=950&q=85&auto=format&fit=crop',
  meghalaya: 'https://images.unsplash.com/photo-1626014303757-646633783a30?w=800&h=950&q=85&auto=format&fit=crop',
  andaman: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&h=950&q=85&auto=format&fit=crop',
  hampi: 'https://images.unsplash.com/photo-1600100397608-f010f4448554?w=800&h=950&q=85&auto=format&fit=crop',
  kashmir: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&h=950&q=85&auto=format&fit=crop',
  varanasi: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=800&h=950&q=85&auto=format&fit=crop',
  gokarna: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=950&q=85&auto=format&fit=crop',
  munnar: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=950&q=85&auto=format&fit=crop',
  coorg: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&h=950&q=85&auto=format&fit=crop',
  jaisalmer: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&h=950&q=85&auto=format&fit=crop',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=950&q=85&auto=format&fit=crop',
  switzerland: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=950&q=85&auto=format&fit=crop',
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=950&q=85&auto=format&fit=crop',
  serengeti: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=950&q=85&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=950&q=85&auto=format&fit=crop'
};

const getSmartPhoto = (text) => {
  const lower = (text || '').toLowerCase();
  for (const key of Object.keys(PHOTO_MAP)) {
    if (lower.includes(key)) return PHOTO_MAP[key];
  }
  return PHOTO_MAP.default;
};

// @route   POST /api/gemini/generate-destinations
// @desc    Generate personalized destinations using Gemini AI
router.post('/generate-destinations', async (req, res) => {
  try {
    const { prompt, count = 3, apiKey } = req.body;
    const keyToUse = apiKey || process.env.GEMINI_API_KEY;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    if (keyToUse) {
      try {
        const ai = new GoogleGenAI({ apiKey: keyToUse });
        const systemInstruction = `You are an elite luxury travel curator specializing in solo, safe, and culturally rich travel, with strong expertise in India and top global destinations.
Generate an array of ${count} destinations in valid JSON based on user prompt.
Format MUST strictly be a JSON Array with objects having:
- id: string (kebab-case)
- name: string
- country: string
- region: string
- priceInINR: number (in INR rupees, e.g. 35000)
- priceInUSD: number (in USD, e.g. 420)
- tag: string ("ADVENTURE" | "CULTURE" | "HERITAGE" | "WELLNESS" | "WILDLIFE" | "COASTAL")
- rating: number (e.g. 4.9)
- reviews: string (e.g. "1.4k")
- description: string (2-3 sentences of inspiring, evocative travel copy)
- activities: array of strings (e.g. ["Hiking & Trekking", "Museums & Art"])
- duration: string (e.g. "5 Days / 4 Nights")
- safetyScore: string (e.g. "9.8 / 10")
- bestSeason: string (e.g. "Oct - March")
- highlights: array of 4 strings (e.g. ["Monastery Sunrise", "Local Cooking", ...])
- imageQuery: string (a one-word keyword for photo matching, e.g. "kerala", "ladakh", "rajasthan")
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Generate ${count} destinations for query: "${prompt}". Special focus on India if applicable or requested. Return ONLY JSON.`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });

        const jsonText = response.text || '[]';
        let parsed = JSON.parse(jsonText);
        if (!Array.isArray(parsed) && parsed.destinations) {
          parsed = parsed.destinations;
        }

        // Attach high-res images
        const enriched = parsed.map((item, idx) => ({
          ...item,
          id: item.id || `custom-${Date.now()}-${idx}`,
          priceDisplayINR: `₹${(item.priceInINR || 35000).toLocaleString('en-IN')}`,
          priceDisplayUSD: `$${(item.priceInUSD || 420).toLocaleString('en-US')}`,
          img: getSmartPhoto(item.imageQuery || item.name || item.region || item.country),
        }));

        return res.json({ success: true, source: 'gemini-ai', destinations: enriched });
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to smart dynamic generator:', geminiError.message);
      }
    }

    // High-quality smart dynamic fallback when API key is not configured or rate limited
    const p = prompt.toLowerCase();
    const fallbackResults = [
      {
        id: `ai-india-${Date.now()}-1`,
        name: p.includes('beach') || p.includes('water') ? 'Gokarna Bohemian Coastal Sanctuary' : p.includes('mountain') || p.includes('trek') ? 'Spiti Valley Celestial High-Pass' : 'Udaipur Royal Lake Palace Odyssey',
        country: 'India',
        region: p.includes('beach') ? 'Karnataka' : p.includes('mountain') ? 'Himachal Pradesh' : 'Rajasthan',
        priceInINR: p.includes('beach') ? 22000 : p.includes('mountain') ? 36000 : 45000,
        priceInUSD: p.includes('beach') ? 260 : p.includes('mountain') ? 425 : 530,
        priceDisplayINR: p.includes('beach') ? '₹22,000' : p.includes('mountain') ? '₹36,000' : '₹45,000',
        priceDisplayUSD: p.includes('beach') ? '$260' : p.includes('mountain') ? '$425' : '$530',
        tag: p.includes('mountain') ? 'ADVENTURE' : p.includes('beach') ? 'COASTAL' : 'HERITAGE',
        rating: 4.9,
        reviews: '1.4k',
        description: `Custom curated for "${prompt}". Experience private boutique stays, verified local women-friendly safety escorts, and immersive cultural heritage.`,
        img: p.includes('beach') ? PHOTO_MAP.gokarna : p.includes('mountain') ? PHOTO_MAP.spiti : PHOTO_MAP.udaipur,
        activities: p.includes('beach') ? ['Water Sports'] : ['Hiking & Trekking', 'Museums & Art'],
        duration: '6 Days / 5 Nights',
        safetyScore: '9.8 / 10',
        bestSeason: 'October to March',
        highlights: ['Private Sunset Sail', 'Authentic Heritage Cuisine', 'Certified Solo Safety Guide', 'Hidden Secret Viewpoints'],
      },
      {
        id: `ai-india-${Date.now()}-2`,
        name: 'Meghalaya Living Roots & Azure Pools',
        country: 'India',
        region: 'Northeast India',
        priceInINR: 39000,
        priceInUSD: 460,
        priceDisplayINR: '₹39,000',
        priceDisplayUSD: '$460',
        tag: 'ADVENTURE',
        rating: 5.0,
        reviews: '920',
        description: 'Trek ancient living root bridges, kayak through crystal-clear Umngot river, and relax in eco-luxury bamboo treehouses.',
        img: PHOTO_MAP.meghalaya,
        activities: ['Hiking & Trekking', 'Water Sports'],
        duration: '7 Days / 6 Nights',
        safetyScore: '9.9 / 10',
        bestSeason: 'Sept to April',
        highlights: ['Double Decker Root Bridge Hike', 'Dawki Crystal River Kayak', 'Mawlynnong Cleanest Village Stay', 'Caving Expeditions'],
      },
      {
        id: `ai-india-${Date.now()}-3`,
        name: 'Kerala Backwaters & Holistic Ayurveda',
        country: 'India',
        region: 'Alleppey & Munnar',
        priceInINR: 38000,
        priceInUSD: 450,
        priceDisplayINR: '₹38,000',
        priceDisplayUSD: '$450',
        tag: 'WELLNESS',
        rating: 4.9,
        reviews: '2.3k',
        description: 'Glide through palm-fringed lagoons on a luxury solar houseboat and rejuvenate with traditional Kerala Ayurvedic treatments.',
        img: PHOTO_MAP.kerala,
        activities: ['Museums & Art', 'Water Sports'],
        duration: '6 Days / 5 Nights',
        safetyScore: '9.9 / 10',
        bestSeason: 'Year Round (Best: Nov - Feb)',
        highlights: ['Private Houseboat Cruise', 'Organic Spice Plantation Tour', 'Daily Yoga & Panchakarma', 'Kathakali Dance Night'],
      }
    ];

    res.json({ success: true, source: 'curated-generator', destinations: fallbackResults });
  } catch (error) {
    console.error('Destination generation error:', error);
    res.status(500).json({ message: 'Failed to generate destinations', error: error.message });
  }
});

module.exports = router;
