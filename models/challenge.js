const mongoose = require('mongoose');

const Challenge = new mongoose.Schema({
  name: String,
  description: String,
  hints: [String],
  flagCaseSensitive: Boolean,
  points: Number,
  flag: String,
});

module.exports = mongoose.model('challenge', Challenge);
