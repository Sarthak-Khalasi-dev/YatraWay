const EmergencyContact = require('../models/emergencyModel');

// @desc    Get all user emergency contacts
// @route   GET /api/emergency
// @access  Private
const getContacts = async (req, res) => {
  const contacts = await EmergencyContact.find({ user: req.user._id });
  res.json(contacts);
};

// @desc    Create a new emergency contact
// @route   POST /api/emergency
// @access  Private
const createContact = async (req, res) => {
  const { name, relation, phone } = req.body;

  const contact = new EmergencyContact({
    user: req.user._id,
    name, relation, phone,
    initial: name.charAt(0).toUpperCase(),
  });

  const createdContact = await contact.save();
  res.status(201).json(createdContact);
};

// @desc    Delete a contact
// @route   DELETE /api/emergency/:id
// @access  Private
const deleteContact = async (req, res) => {
  const contact = await EmergencyContact.findById(req.params.id);

  if (contact) {
    if (contact.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    await contact.deleteOne();
    res.json({ message: 'Contact removed' });
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
};

module.exports = {
  getContacts,
  createContact,
  deleteContact,
};
