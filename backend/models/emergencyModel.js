const mongoose = require('mongoose');

const emergencyContactSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relation: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);
module.exports = EmergencyContact;
