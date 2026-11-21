const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

const parseDateParts = (dateStr, isoStr) => {
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const target = isoStr || dateStr || "";
  if (!target) return { day: "", month: "" };
  const d = new Date(target);
  if (!isNaN(d.getTime())) {
    return { day: String(d.getDate()), month: months[d.getMonth()] };
  }
  const match = target.match(/([a-zA-Z]+)\s+(\d{1,2})|(\d{1,2})\s+([a-zA-Z]+)/);
  if (match) {
    if (match[1] && match[2]) {
      return { day: match[2], month: match[1].slice(0, 3).toUpperCase() };
    } else if (match[3] && match[4]) {
      return { day: match[3], month: match[4].slice(0, 3).toUpperCase() };
    }
  }
  return { day: "", month: "" };
};

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: 1 });
    const formatted = events.map(item => {
      const obj = item.toObject();
      let day = obj.day;
      let month = obj.month;
      if (!day || !month) {
        const parts = parseDateParts(obj.date, obj.dateISO);
        day = day || parts.day;
        month = month || parts.month;
      }
      return {
        ...obj,
        id: item._id,
        day: day || '',
        month: month || ''
      };
    });
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.day || !payload.month) {
      const parts = parseDateParts(payload.date, payload.dateISO);
      payload.day = payload.day || parts.day;
      payload.month = payload.month || parts.month;
    }
    const newEvent = await new Event(payload).save();
    res.status(201).json({...newEvent.toObject(), id: newEvent._id});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.day || !payload.month) {
      const parts = parseDateParts(payload.date, payload.dateISO);
      payload.day = payload.day || parts.day;
      payload.month = payload.month || parts.month;
    }
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, payload, { new: true });
    res.json({...updatedEvent.toObject(), id: updatedEvent._id});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
