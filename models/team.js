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
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    firstName: {
      type: String
    },
  }],
  budget: {
    type: Number,
    required: true,
    default: 5000000,
  },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
