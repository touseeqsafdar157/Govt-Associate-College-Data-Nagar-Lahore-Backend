const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
  isNew: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
