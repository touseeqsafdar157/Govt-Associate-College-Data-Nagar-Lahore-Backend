const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  summary: { type: String, default: '' },
  content: { type: String, required: true },
  category: { type: String, default: 'General' },
  fileUrl: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
