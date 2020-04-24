const mongoose = require('mongoose');

const Challenge = new mongoose.Schema({
  name: String,
  prerequisites: [Number],
  id: [Number],
  description: [String],
  hints: [String],
  staticScoring: [Boolean],
  points: Number,
});

module.exports = mongoose.model('Challenge', Challenge);



