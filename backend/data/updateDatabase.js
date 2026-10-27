const job = require('../models/jobs')

const updateDatabase = async (io) => {

  // The main job array
  const allJobs = [];

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
    // Get the API from GreenHouse API
    // Can also add other public free API sources
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
        id: `greenhouse-${company.token}-${rawJob.id}`,
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
  // Current jobs in database
  const oldJobs = await job.find({});

  // O(1) average lookup
  const oldIds = new Set(
    oldJobs.map(job => job.id)
  );

  const newIds = new Set(
    allJobs.map(job => job.id)
  );

  // Jobs from API that aren't in database
  const newJobs = allJobs.filter(
    job => !oldIds.has(job.id)
  );

  // Jobs in database that aren't in API anymore
  const expiredJobs = oldJobs.filter(
    job => !newIds.has(job.id)
  );

  // Insert only new jobs, may be implmented after
  if (newJobs.length > 0) {
    await job.insertMany(newJobs);

    // Send new jobs to connected clients
    io.emit("newJobs", newJobs);
  }

  // Delete only expired jobs
  const expiredIds = expiredJobs.map(job => job.id);
  await job.deleteMany({
    id: {
      $in: expiredIds
    }
  });

  // Send entire updated list
  const updatedJobs = await job.find({});

  io.emit("jobUpdate", updatedJobs);
}

module.exports = updateDatabase;