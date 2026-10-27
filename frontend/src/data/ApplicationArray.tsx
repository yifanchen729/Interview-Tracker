export type ApplicationStatus =
  | "To Apply"
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Rejected";

export type StatusEntry = {
  status: ApplicationStatus;
  changedAt: string | null;
};

export type Application = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  statusHistory: StatusEntry[];
  nextStep: string;
  date: string;
  location: string;
};

export class ApplicationArray {
  applications: Application[];

  constructor() {
    const companies = [
      "Google",
      "Microsoft",
      "Amazon",
      "Meta",
      "Figma",
      "Datadog",
      "Stripe",
      "Airbnb",
      "Cloudflare",
      "Discord",
      "Reddit",
      "Robinhood",
      "Apple",
      "Netflix",
      "Uber",
      "Lyft",
      "DoorDash",
      "LinkedIn",
      "Salesforce",
      "Adobe",
    ];

    const roles = [
      "Software Engineer Intern",
      "SWE Intern",
      "Frontend Engineer Intern",
      "Backend Engineer Intern",
      "Full Stack Engineer Intern",
    ];

    const locations = [
      "San Francisco, CA",
      "Seattle, WA",
      "New York, NY",
      "Austin, TX",
      "Redmond, WA",
      "Menlo Park, CA",
      "Cupertino, CA",
      "Remote",
    ];

    this.applications = [];

    for (let i = 0; i < 100; i++) {
      const company =
        companies[Math.floor(Math.random() * companies.length)];

      const role =
        roles[Math.floor(Math.random() * roles.length)];

      const location =
        locations[Math.floor(Math.random() * locations.length)];

      // Random number determines which pipeline path this application takes
      const random = Math.random();

      let status: ApplicationStatus;
      let statusHistory: StatusEntry[];

      // 10% To Apply
      if (random < 0.1) {
        status = "To Apply";
        statusHistory = [];
      }

      // 30% Applied and waiting
      else if (random < 0.4) {
        status = "Applied";

        statusHistory = [
          {
            status: "Applied",
            changedAt: "2026-09-20T14:30:00",
          },
        ];
      }

      // 20% Rejected before interview
      else if (random < 0.6) {
        status = "Rejected";

        statusHistory = [
          {
            status: "Applied",
            changedAt: "2026-09-20T14:30:00",
          },
          {
            status: "Rejected",
            changedAt: "2026-10-01T10:00:00",
          },
        ];
      }

      // 20% Currently interviewing
      else if (random < 0.8) {
        status = "Interviewing";

        statusHistory = [
          {
            status: "Applied",
            changedAt: "2026-09-20T14:30:00",
          },
          {
            status: "Interviewing",
            changedAt: "2026-10-05T10:00:00",
          },
        ];
      }

      // 10% Rejected after interview
      else if (random < 0.9) {
        status = "Rejected";

        statusHistory = [
          {
            status: "Applied",
            changedAt: "2026-09-20T14:30:00",
          },
          {
            status: "Interviewing",
            changedAt: "2026-10-05T10:00:00",
          },
          {
            status: "Rejected",
            changedAt: "2026-10-15T10:00:00",
          },
        ];
      }

      // 10% Offer
      else {
        status = "Offer";

        statusHistory = [
          {
            status: "Applied",
            changedAt: "2026-09-20T14:30:00",
          },
          {
            status: "Interviewing",
            changedAt: "2026-10-05T10:00:00",
          },
          {
            status: "Offer",
            changedAt: "2026-10-20T10:00:00",
          },
        ];
      }

      this.applications.push({
        id: crypto.randomUUID(),
        company,
        role,
        status,
        statusHistory,
        nextStep: "",
        date: "10/26/2026",
        location,
      });
    }
  }
}