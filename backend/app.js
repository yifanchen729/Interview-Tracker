const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const { OAuth2Client } = require("google-auth-library");
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config()

const connectDB = require('./db/connect')
const jobs = require('./models/jobs')
const users = require('./models/users')
const applications = require("./models/applications");

const updateDatabase = require('./data/updateDatabase')

app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

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

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await users.findOne({ googleId: sub });
    if (!user) {
      user = await users.create({
        googleId: sub,
        email,
        name,
        picture,
      });
    }

    const authToken = jwt.sign(
      {
        // Uses my MongoDB generated ID
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        // This is how long the backend consider the JWT valid
        expiresIn: "7d",
      }
    );

    res.cookie("authToken", authToken, {
      // Prevent JS to read the cookie
      httpOnly: true,
      // Controls HTTP or HTTPS
      // True: HTTPS only
      // False: HTTP can send
      // Cookie sent only over HTTPS on production but can do HTTP on localhost
      secure: process.env.NODE_ENV === "production",
      // Controls cross-site cookie behavior, to mitigate
      // CSRF (Cross Site Request Forgery), a way to use another browser
      // to trick this browser to do malicious actions usings the cookie token
      // Strict: strongest restriction
      // Lax: allow some
      // None: allow all
      sameSite: "lax",
      // How long this is alive for in ms, this is currently 7 days
      // This is how long the browser stores the JWT
      // Should match with how long backend consider the JWT
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Google login successful",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: "Invalid Google token",
    });
  }
});

const requireAuth = (req, res, next) => {
  // Get authToken
  const authToken = req.cookies.authToken;

  if (!authToken) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Verify if it is valid
  try {
    const decoded = jwt.verify(
      authToken,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await users.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({user});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Logout successful",
  });
});

app.get("/api/applications", requireAuth, async (req, res) => {
  try {
    const userApplications = await applications.find({
      userId: req.userId,
    });

    res.status(200).json(userApplications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get applications",
    });
  }
});;

app.post("/api/applications", requireAuth, async (req, res) => {
  try {
    const application = await applications.create({
      userId: req.userId,
      jobId: req.body.jobId,
      company: req.body.company,
      role: req.body.role,
      status: req.body.status,
      statusHistory: req.body.statusHistory,
      nextStep: req.body.nextStep,
      date: req.body.date,
      location: req.body.location,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create application",
    });
  }
});

app.put("/api/applications/:jobId", requireAuth, async (req, res) => {
  try {
    const application = await applications.findOneAndUpdate(
      // Finds the first one that match (here it should be unique)
      {
        jobId: req.params.jobId,
        userId: req.userId,
      },
      {
        company: req.body.company,
        role: req.body.role,
        status: req.body.status,
        statusHistory: req.body.statusHistory,
        nextStep: req.body.nextStep,
        date: req.body.date,
        location: req.body.location,
      },
      {
        // This config Mongoose to return the document after update,
        // by default it does the old one
        new: true,
        // Let Mongoose check the new values against schema rules
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update application",
    });
  }
});

app.delete("/api/applications/:jobId", requireAuth, async (req, res) => {
  try {
    const application = await applications.findOneAndDelete({
      jobId: req.params.jobId,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete application",
    });
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