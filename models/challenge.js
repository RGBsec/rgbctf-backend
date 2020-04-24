const mongoose = require('mongoose');

const Challenge = new mongoose.Schema({
  prerequisites: [Number],
  id: [Number],
  description: [String],
  hints: [String],
  staticScoring: [Boolean],
  points: Number,
});

module.exports = mongoose.model('Challenge', Challenge);



