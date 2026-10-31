const mongoose = require("mongoose");

const applicationStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["To Apply", "Applied", "Interviewing", "Offer", "Rejected"],
      required: true,
    },
    changedAt: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  jobId: {
    type: String,
    required: true,
  },

  company: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["To Apply", "Applied", "Interviewing", "Offer", "Rejected"],
    default: "To Apply",
  },

  statusHistory: {
    type: [applicationStatusSchema],
    default: [],
  },

  nextStep: {
    type: String,
    default: "",
  },

  date: {
    type: String,
    default: null,
  },

  location: {
    type: String,
    default: "",
  },
});

// Avoid every user to have more than 1 application with the same jobId
applicationSchema.index(
  { userId: 1, jobId: 1 },
  { unique: true }
);

module.exports = mongoose.model("applications", applicationSchema);