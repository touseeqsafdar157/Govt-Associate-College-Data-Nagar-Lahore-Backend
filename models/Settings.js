const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  principalMessage: { type: String, default: "" },
  contactInfo: {
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
