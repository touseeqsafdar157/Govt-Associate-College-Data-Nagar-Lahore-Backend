const express = require('express');
const router = express.Router();
const Facility = require('../models/Facility');

// Get all facilities
router.get('/', async (req, res) => {
  try {
    const count = await Facility.countDocuments();
    if (count === 0) {
      await Facility.insertMany([
        { category: "Laboratory", title: "Physics Laboratory", description: "Fully equipped physics lab for hands-on experiments covering mechanics, optics, and electromagnetism.", iconName: "Microscope", capacity: "50 Students", instructor: "Prof. Amir Khan", equipmentList: ["Oscilloscopes", "Spectrometers", "Vernier Calipers", "Laser Setup"] },
        { category: "Laboratory", title: "Computer Lab 1", description: "High-performance computing facility with internet access for programming and software development.", iconName: "Monitor", capacity: "60 Students", instructor: "Prof. Fatima Noor", equipmentList: ["60 Core i7 PCs", "High-speed Wi-Fi", "Projector", "Air Conditioning"] },
        { category: "Sports", title: "Cricket Ground", description: "Maintained cricket ground with practice nets for college tournaments.", iconName: "Trophy", capacity: "Full Team", instructor: "Mr. Noman Khawaja" },
        { category: "Sports", title: "Gymnasium", description: "Indoor gym with weightlifting and fitness equipment.", iconName: "Dumbbell", capacity: "30 Students", instructor: "Mr. Noman Khawaja" },
        { category: "Other", title: "Cafeteria", description: "Hygienic and affordable food options for students and staff.", iconName: "Building2" },
        { category: "Other", title: "Medical Center", description: "First aid and basic medical facilities available on campus.", iconName: "Target" }
      ]);
    }
    const facilities = await Facility.find().sort({ createdAt: -1 });
    res.json(facilities.map(f => ({ ...f.toObject(), id: f._id })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a facility
router.post('/', async (req, res) => {
  try {
    const facility = new Facility(req.body);
    const savedFacility = await facility.save();
    res.status(201).json({ ...savedFacility.toObject(), id: savedFacility._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a facility
router.put('/:id', async (req, res) => {
  try {
    const updatedFacility = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ...updatedFacility.toObject(), id: updatedFacility._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a facility
router.delete('/:id', async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id);
    res.json({ message: 'Facility deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
