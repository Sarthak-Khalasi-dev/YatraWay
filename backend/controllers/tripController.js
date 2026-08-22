const Trip = require('../models/tripModel');

// @desc    Get all user trips
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
  const trips = await Trip.find({ user: req.user._id });
  res.json(trips);
};

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  const { dest, dates, status, days, budget, spent, members, progress, notes, img, activities } = req.body;

  const trip = new Trip({
    user: req.user._id,
    dest, dates, status, days, budget, spent, members, progress, notes, img, activities
  });

  const createdTrip = await trip.save();
  res.status(201).json(createdTrip);
};

// @desc    Update a trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (trip) {
    if (trip.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    trip.dest = req.body.dest || trip.dest;
    trip.dates = req.body.dates || trip.dates;
    trip.status = req.body.status || trip.status;
    trip.days = req.body.days || trip.days;
    trip.budget = req.body.budget || trip.budget;
    trip.spent = req.body.spent || trip.spent;
    trip.members = req.body.members || trip.members;
    trip.progress = req.body.progress || trip.progress;
    trip.notes = req.body.notes || trip.notes;
    trip.img = req.body.img || trip.img;
    trip.activities = req.body.activities || trip.activities;

    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } else {
    res.status(404).json({ message: 'Trip not found' });
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (trip) {
    if (trip.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await trip.deleteOne();
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
