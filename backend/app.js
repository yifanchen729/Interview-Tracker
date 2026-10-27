const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const { GoogleGenAI } = require("@google/genai");
require('dotenv').config()

const connectDB = require('./db/connect')
const jobs = require('./models/jobs')
const updateDatabase = require('./data/updateDatabase')

app.use(express.json());
const cors = require("cors");
app.use(cors());

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Actual API
app.get('/api/jobs', async (req, res) => {
  const result = await jobs.find({});
  res.status(200).json({ result })
})


// This endpoint for external API calling
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
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log("Connected to MongoDB")
    server.listen(port, console.log(`Server is listening on port ${port}...`))

    // Updates the database every hour
    setInterval(async () => {
      try {
        console.log("Updating job database...");
        await updateDatabase(io);
      } catch (error) {
        console.log("Failed to update database:", error);
      }
    }, 60 * 60 * 1000);

  } catch (error) {
    console.log(error)
  }
}

start();

// For development only
app.get('/api/updateDatabase', async (req, res) => {
  await updateDatabase(io);
  res.status(200).json("done")
})