const Booking = require('../models/bookingModel');

// @desc    Get all user bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(bookings);
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { type, name, details, date, price, status } = req.body;

  const booking = new Booking({
    user: req.user._id,
    type,
    name,
    details,
    date,
    price,
    status,
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
};

// @desc    Update a booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404).json({ message: 'Booking not found' });
    return;
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  booking.type = req.body.type || booking.type;
  booking.name = req.body.name || booking.name;
  booking.details = req.body.details ?? booking.details;
  booking.date = req.body.date ?? booking.date;
  booking.price = req.body.price ?? booking.price;
  booking.status = req.body.status || booking.status;

  const updatedBooking = await booking.save();
  res.json(updatedBooking);
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404).json({ message: 'Booking not found' });
    return;
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  await booking.deleteOne();
  res.json({ message: 'Booking removed' });
};

module.exports = {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
};
