const mongoose = require('mongoose');

// This is the data structure in the data base
// id: crypto.randomUUID(),
// company: rawJob.company_name,
// role: rawJob.title,
// status: "To Apply",
// nextStep: "",
// date: "", //
// location: rawJob.location.name, //
// // Extra info
// url: rawJob.absolute_url,
// publishedAt: rawJob.first_published || "None",
// updatedAt: rawJob.updated_at || "None",
// deadlineAt: rawJob.application_deadline || "None"

const TaskSchema = new mongoose.Schema({
  id:
  {
    type:String, 
  },
  company:{
    type:String
  },
  role:{
    type:String
  },
  status:{
    type:String
  },
  nextStep:{
    type:String
  },
  date:{
    type:String
  },
  location:{
    type:String
  },
  url:{
    type:String
  },
  publishedAt:{
    type:String
  },
  updatedAt:{
    type:String
  },
  deadlineAt:{
    type:String
  }
});

// This determines the naming of the document in MongoDB
// It will automatically lowercase all and add suffix -s if there is none
module.exports = mongoose.model('jobs', TaskSchema)