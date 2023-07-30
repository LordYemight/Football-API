const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  }],
  budget: {
    type: Number,
    required: true,
    default: 5000000,
  },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
