const mongoose = require('mongoose');
const resultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  class: { type: String, required: true },
  year: { type: String, required: true },
  marks: { type: Number, required: true },
  totalMarks: { type: Number, default: 1100 },
  grade: { type: String },
  position: { type: String },
  photo: { type: String },
  status: { type: String, default: 'Pass' }
}, { timestamps: true });
module.exports = mongoose.model('Result', resultSchema);
