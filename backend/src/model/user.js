const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('UserDetails', userSchema);