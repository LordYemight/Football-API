const express = require('express');
const connectDB = require('./models/db');
const router = require('./routes/router');
const app = express();
const port = process.env.port



app.use(express.json());
app.use('/', router);

app.listen(port, async () => {
  await connectDB;
  console.log(`server listening on ${port}`)
})