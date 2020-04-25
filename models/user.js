const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: String,
  hash: String,
  salt: String,
  cookie: String,
});

module.exports = mongoose.model('User', User);
