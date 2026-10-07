const express = require('express');
const app = express();

require('dotenv').config()
const connectDB = require('./db/connect')

const jobs = require('./models/jobs')

app.use(express.json());

const cors = require("cors");

app.use(cors());

// Actual API
app.get('/api/jobs', async (req, res) => {
  const result = await jobs.find({});
  res.status(200).json({ result })
})


// Sets up the server
const port = 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}

start();

// For development only
app.get('/updateDatabase', async (req, res) => {
  const updateDatabase = require('./data/updateDatabase')
  updateDatabase();
  res.status(200).json("done")
})