// Standalone Trip Controller with in-memory store
let tripsStore = [
  {
    _id: 'trip_1',
    dest: 'Bali, Indonesia',
    dates: '20 May - 02 June 2024',
    status: 'Upcoming',
    days: 12,
    budget: 85000,
    spent: 32000,
    members: 2,
    progress: 80,
    notes: 'Book scuba diving session in Nusa Penida. Visit Tanlot Temple at sunset.',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80&auto=format&fit=crop',
    activities: [
      { id: 1, text: 'Visit Tanah Lot Temple', done: true },
      { id: 2, text: 'Scuba Diving at Nusa Penida', done: false },
      { id: 3, text: 'Ubud Monkey Forest Walk', done: true },
    ]
  },
  {
    _id: 'trip_2',
    dest: 'Switzerland',
    dates: '15 Jul - 25 Jul 2024',
    status: 'Upcoming',
    days: 10,
    budget: 150000,
    spent: 45000,
    members: 2,
    progress: 40,
    notes: 'Swiss Travel Pass acquired.',
    img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80&auto=format&fit=crop',
    activities: [
      { id: 1, text: 'Jungfraujoch Top of Europe', done: false },
      { id: 2, text: 'Lake Geneva Boat Cruise', done: true },
    ]
  },
  {
    _id: 'trip_3',
    dest: 'Thailand',
    dates: '10 Aug - 20 Aug 2024',
    status: 'Upcoming',
    days: 7,
    budget: 60000,
    spent: 12000,
    members: 2,
    progress: 25,
    notes: 'Island hopping in Phuket.',
    img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80&auto=format&fit=crop',
    activities: [
      { id: 1, text: 'Phi Phi Islands Day Tour', done: false }
    ]
  }
];

const getTrips = async (req, res) => {
  res.json(tripsStore);
};

const createTrip = async (req, res) => {
  const newTrip = {
    _id: 'trip_' + Date.now(),
    ...req.body,
  };
  tripsStore.unshift(newTrip);
  res.status(201).json(newTrip);
};

const updateTrip = async (req, res) => {
  const idx = tripsStore.findIndex(t => t._id === req.params.id);
  if (idx !== -1) {
    tripsStore[idx] = { ...tripsStore[idx], ...req.body };
    res.json(tripsStore[idx]);
  } else {
    res.status(404).json({ message: 'Trip not found' });
  }
};

const deleteTrip = async (req, res) => {
  const idx = tripsStore.findIndex(t => t._id === req.params.id);
  if (idx !== -1) {
    tripsStore.splice(idx, 1);
    res.json({ message: 'Trip removed' });
  } else {
    res.status(404).json({ message: 'Trip not found' });
  }
};

module.exports = {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
};
