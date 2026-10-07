const path = require('path');
const { writeFileSync } = require('fs')
const job = require('../models/jobs')

// This file have a companies array, and use it to load all data into
// 1) Database or
// 2) A file called jobList.json
const updateDatabase = async () => {

  // The main job array
  const allJobs = [];

  // There used to be another writeFileSync which prevent the one
  // below from actually functioning

  const companies = [
    { name: "Stripe", token: "stripe" },
    { name: "Airbnb", token: "airbnb" },
    { name: "Datadog", token: "datadog" },
    { name: "Figma", token: "figma" },
    { name: "Cloudflare", token: "cloudflare" },
    { name: "Discord", token: "discord" },
    { name: "Reddit", token: "reddit" },
    { name: "Robinhood", token: "robinhood" }
  ];

  // Loop for every company
  for (const company of companies) {
    // Get the API
    const response = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${company.token}/jobs`
    );

    // Parse from JSON to JS object
    const data = await response.json();

    // Get the job array
    const rawJobList = data.jobs;

    // Extract useful info
    const jobList = rawJobList.map((rawJob) => {
      return {
        id: crypto.randomUUID(),
        company: rawJob.company_name,
        role: rawJob.title,
        status: "To Apply",
        nextStep: "",
        date: "",
        location: rawJob.location.name,
        // Extra info
        url: rawJob.absolute_url,
        publishedAt: rawJob.first_published || "None",
        updatedAt: rawJob.updated_at || "None",
        deadlineAt: rawJob.application_deadline || "None"
      }
    })

    // Load all into the main array
    allJobs.push(...jobList);
  }

  // Write to jobList.json
  // writeFileSync(
  //   path.join(__dirname, 'jobList.json'),
  //   JSON.stringify(allJobs, null, 2)
  // )

  // Override the database
  await job.deleteMany({});
  await job.insertMany(allJobs);
}

module.exports = updateDatabase;