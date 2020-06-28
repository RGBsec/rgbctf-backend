const mongoose = require('mongoose');

const Team = new mongoose.Schema({
  name: String,
  inviteCode: String,
  members: [String],
  points: Number,
  solves: [String],
});

module.exports = mongoose.model('Team', Team);
