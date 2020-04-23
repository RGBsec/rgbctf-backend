const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: String,
  hash: String,
});

module.exports = mongoose.model('User', User);
