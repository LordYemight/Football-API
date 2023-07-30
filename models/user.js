const mongoose = require("mongoose");
const moment = require('moment-timezone')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: moment().tz('Your_Timezone').add(1, 'hours').toDate(),
  }
});  

const user = mongoose.model("user", userSchema);

module.exports = user;
