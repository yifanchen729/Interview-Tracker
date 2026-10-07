export type Application = {
  id: string;
  company: string;
  role: string;
  status: string;
  nextStep: string;
  date: string;
  location: string;
};

export class ApplicationArray {
  
  applications: Application[];

  // Default values
  constructor() {
    this.applications = [
      {
        id: crypto.randomUUID(),
        company: "Google",
        role: "SWE",
        status: "Applied",
        nextStep: "Waiting for response",
        date: "9/20/1202",
        location: "Cupertino, CA",
      },
      {
        id: crypto.randomUUID(),
        company: "Microsoft",
        role: "Software Engineer Intern",
        status: "Interviewing",
        nextStep: "Technical Interview",
        date: "10/05/2026",
        location: "Redmond, WA",
      },
      {
        id: crypto.randomUUID(),
        company: "Amazon",
        role: "SDE Intern",
        status: "Rejected",
        nextStep: "None",
        date: "09/25/2026",
        location: "Seattle, WA",
      },
      {
        id: crypto.randomUUID(),
        company: "Meta",
        role: "Software Engineer Intern",
        status: "Offer",
        nextStep: "Review Offer",
        date: "10/12/2026",
        location: "Menlo Park, CA",
      },
      {
        id: crypto.randomUUID(),
        company: "Meta",
        role: "Software Engineer Intern",
        status: "Offer",
        nextStep: "Review Offer",
        date: "10/12/2026",
        location: "Menlo Park, CA",
      },
    ];
  }
}
