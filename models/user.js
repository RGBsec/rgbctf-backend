const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: String,
  hash: String,
  salt: String,
  teamId: String,
  email: String,
  confirmedEmail: Boolean,
});

module.exports = mongoose.model('user', User);
