const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  dateISO: { type: String },
  month: { type: String },
  day: { type: String },
  time: { type: String, default: '' },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
