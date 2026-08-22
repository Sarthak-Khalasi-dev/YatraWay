const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  dest: { type: String, required: true },
  dates: { type: String, required: true },
  status: { type: String, default: 'Upcoming' },
  days: { type: Number, default: 0 },
  budget: { type: String, default: '₹0' },
  spent: { type: String, default: '₹0' },
  members: { type: Number, default: 1 },
  progress: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  img: { type: String, default: '' },
  activities: [String],
}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
