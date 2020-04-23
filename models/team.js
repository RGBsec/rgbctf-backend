const mongoose = require('mongoose');

const Team = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model('Team', Team);
