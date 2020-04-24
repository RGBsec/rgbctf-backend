const mongoose = require('mongoose');

const Team = new mongoose.Schema({
  name: String,
  challengesSolved: [Number],
});

module.exports = mongoose.model('Team', Team);
