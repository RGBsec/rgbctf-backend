const mongoose = require('mongoose');

const Challenge = new mongoose.Schema({
  name: String,
  description: [String],
  hints: [String],
  staticScoring: Boolean,
  points: Number,
});

module.exports = mongoose.model('challenge', Challenge);
