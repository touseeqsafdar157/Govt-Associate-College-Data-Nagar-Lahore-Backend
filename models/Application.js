const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  cnic: { type: String, required: true },
  dob: { type: String },
  gender: { type: String },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  program: { type: String, required: true },
  previousInstitution: { type: String },
  previousMarks: { type: String },
  photoUrl: { type: String },
  matricCertUrl: { type: String },
  cnicCopyUrl: { type: String },
  characterCertUrl: { type: String },
  status: { type: String, default: 'Pending' },
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });
module.exports = mongoose.model('Application', applicationSchema);
