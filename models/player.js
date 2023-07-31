const mongoose = require("mongoose");
const moment = require('moment-timezone');


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    unique: true,
  },
  position: {
    type: String,
  }, 
  age: {
    type: Number,
    required: true
  },
  team: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    name: {
      type: String
    },
  },
  marketValue: {
    type: Number,
    required: true
  },
  transferStatus: {
    type: Boolean,
    default: false,
  },
  askingPrice: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: moment().tz('Your_Timezone').add(1, 'hours').toDate(),
  }
});  

const Player = mongoose.model("Player", userSchema);

module.exports = Player;
