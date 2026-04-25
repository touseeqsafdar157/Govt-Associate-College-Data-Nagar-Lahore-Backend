const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  qualification: { type: String, required: true },
  dept: { type: String }, // e.g. Science, Arts, Commerce, Computer
  subject: { type: String },
  experience: { type: String, required: true },
  email: { type: String },
  isHOD: { type: Boolean, default: false },
  staffType: { type: String, enum: ['Teaching', 'Non-Teaching'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
