const express = require('express');
const { GoogleGenAI } = require("@google/genai");

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

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post('/api/airesponse', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `
        You are an AI assistant for a software engineering internship application tracker.
        Answer questions in the context of internship searching and applications.

        User: ${message}

        Answer in less than 60 words, using only words
        `
    });

    res.status(200).json({ response: response.text });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "AI request failed" });
  }
});


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