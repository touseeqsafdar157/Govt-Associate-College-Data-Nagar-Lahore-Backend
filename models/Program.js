const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Intermediate', 'ADP'], required: true },
  duration: { type: String, required: true },
  subjects: { type: String, required: true },
  eligibility: { type: String, required: true },
  fee: { type: String, required: true },
  syllabusUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Program', programSchema);
