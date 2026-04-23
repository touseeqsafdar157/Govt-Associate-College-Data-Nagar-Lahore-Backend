const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await new Settings().save();
    }
    res.json({...settings.toObject(), id: settings._id});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
      await settings.save();
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json({...settings.toObject(), id: settings._id});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
