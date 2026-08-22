const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  type: { type: String, required: true }, // Flight, Hotel, Activity
  name: { type: String, required: true },
  details: { type: String, default: '' },
  date: { type: String, default: '' },
  price: { type: String, default: '' },
  status: { type: String, default: 'Confirmed' },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
