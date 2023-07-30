const mongoose = require ('mongoose');
require('dotenv/config');


const connectDB = mongoose.connect (process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('connected to database')
}).catch ((error) => {
  console.error ('error connecting to database:', error)
}) 

module.exports = connectDB;