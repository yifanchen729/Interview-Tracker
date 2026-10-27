import type {
  Application,
  ApplicationStatus
} from "../../data/ApplicationArray";

import "./ApplicationForm.css";

// Props
type ApplicationFormProp = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  setAddingApplication: React.Dispatch<React.SetStateAction<boolean>>
};

export function ApplicationForm({ applications, setApplications, setAddingApplication }: ApplicationFormProp) {

  function createStatusHistory(status: ApplicationStatus) {
    const now = new Date().toISOString();

    if (status === "To Apply") {
      return [];
    }

    if (status === "Applied") {
      return [
        {
          status: "Applied" as const,
          changedAt: now,
        },
      ];
    }

    if (status === "Interviewing") {
      return [
        {
          status: "Applied" as const,
          changedAt: null,
        },
        {
          status: "Interviewing" as const,
          changedAt: now,
        },
      ];
    }

    if (status === "Offer") {
      return [
        {
          status: "Applied" as const,
          changedAt: null,
        },
        {
          status: "Interviewing" as const,
          changedAt: null,
        },
        {
          status: "Offer" as const,
          changedAt: now,
        },
      ];
    }

    // Rejected
    return [
      {
        status: "Applied" as const,
        changedAt: null,
      },
      {
        status: "Rejected" as const,
        changedAt: now,
      },
    ];
  }

  // For submit the application
  const submitApplication = (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const newStatus =
      formData.get("status") as ApplicationStatus;

    const newApplication: Application = {
      id: crypto.randomUUID(),
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      status: newStatus,

      statusHistory: createStatusHistory(newStatus),

      nextStep: formData.get("nextStep") as string,
      date: formData.get("date") as string,
      location: formData.get("location") as string,
    };

    setApplications([
      ...applications,
      newApplication
    ]);

    cancelApplication();
  };

  const cancelApplication = () => {
    setAddingApplication(false);
  };

  return (
    // Give the background to blur
    <div className="background"
      onClick={cancelApplication}
    >
      {/* The actual form */}
      <form className="application-form"
        onSubmit={submitApplication}
        onClick={(event) => {
          // This is for stop this from calling the parent's onClick
          event.stopPropagation();
        }}
      >

        {/* Header */}
        <div className="form-heading">
          <div>
            <p className="main-title">NEW APPLICATION</p>
            <p className="sub-title">Track a new opportunity</p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={cancelApplication}
          >
            &times;
          </button>
        </div>

        {/* Label is for FormData to access like a var */}
        {/* Company row */}
        <label>
          Company
          <input
            name="company"
            placeholder="e.g. Google (required)"
            required
          />
        </label>

        {/* Role row */}
        <label>
          Role
          <input
            name="role"
            placeholder="e.g. Software Engineer Intern (required)"
            required
          />
        </label>

        {/* Status and date row */}
        <div className="form-row">
          <label>
            Status
            {/* Select make it a drop down menu */}
            <select name="status">
              <option>To Apply</option>
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </label>

          <label>
            Next date
            <input
              type="date"
              name="date"
            />
          </label>
        </div>

        {/* Next step row */}
        <label>
          Next step
          <input
            name="nextStep"
            placeholder="Technical interview, follow-up..."
          />
        </label>

        {/* Location row */}
        <label>
          Location
          <input
            name="location"
            placeholder="Remote or city (required)"
            required
          />
        </label>

        {/* Button row */}
        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={cancelApplication}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            Add Application
          </button>
        </div>

      </form>
    </div>
  );
}