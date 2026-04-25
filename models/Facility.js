const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  category: { type: String, enum: ['Laboratory', 'Sports', 'Other'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconName: { type: String, default: 'Microscope' }, // stores string like 'Microscope', 'Trophy', etc.
  capacity: { type: String },
  instructor: { type: String },
  equipmentList: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);
