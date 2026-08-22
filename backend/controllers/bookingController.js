// Standalone Booking Controller with in-memory store
let bookingsStore = [
  {
    _id: 'b1',
    type: 'FLIGHT',
    name: 'Bangalore (BLR) → Denpasar (DPS)',
    details: 'Garuda Indonesia · GA-841 · Economy · Seat 14A',
    date: '20 May 2024 · 08:30 AM',
    price: '₹34,500',
    status: 'CONFIRMED'
  },
  {
    _id: 'b2',
    type: 'HOTEL',
    name: 'The Kayon Jungle Resort, Ubud',
    details: 'Valley Villa with Private Pool · 5 Nights · Breakfast Included',
    date: '20 May - 25 May 2024',
    price: '₹52,000',
    status: 'CONFIRMED'
  },
  {
    _id: 'b3',
    type: 'ACTIVITY',
    name: 'Nusa Penida Snorkeling & Manta Ray Tour',
    details: 'Full Day Private Tour · Hotel Pickup & Equipment Included',
    date: '23 May 2024 · 07:00 AM',
    price: '₹6,200',
    status: 'CONFIRMED'
  }
];

const getBookings = async (req, res) => {
  res.json(bookingsStore);
};

const createBooking = async (req, res) => {
  const newBooking = {
    _id: 'b_' + Date.now(),
    ...req.body,
  };
  bookingsStore.unshift(newBooking);
  res.status(201).json(newBooking);
};

const updateBooking = async (req, res) => {
  const idx = bookingsStore.findIndex(b => b._id === req.params.id);
  if (idx !== -1) {
    bookingsStore[idx] = { ...bookingsStore[idx], ...req.body };
    res.json(bookingsStore[idx]);
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
};

const deleteBooking = async (req, res) => {
  const idx = bookingsStore.findIndex(b => b._id === req.params.id);
  if (idx !== -1) {
    bookingsStore.splice(idx, 1);
    res.json({ message: 'Booking removed' });
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
};

module.exports = {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
};
