import axios from "axios";

import type {
  Application,
  ApplicationStatus,
  ApplicationDraft
} from "../../data/ApplicationArray";

import "./ApplicationForm.css";

// Props
type ApplicationFormProp = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  setAddingApplication: React.Dispatch<React.SetStateAction<boolean>>;
  selectedJob: ApplicationDraft | null;
  setSelectedJob: React.Dispatch<
    React.SetStateAction<ApplicationDraft | null>
  >;
};

export function ApplicationForm({ applications, setApplications, setAddingApplication, selectedJob, setSelectedJob }: ApplicationFormProp) {

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
  const submitApplication = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const newStatus =
      formData.get("status") as ApplicationStatus;

    const newApplication = {
      id: selectedJob?.id ?? crypto.randomUUID(),
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      status: newStatus,
      statusHistory: createStatusHistory(newStatus),
      nextStep: formData.get("nextStep") as string,
      date: formData.get("date") as string,
      location: formData.get("location") as string,
    };

    try {
      await axios.post(
        "http://localhost:5000/api/applications",
        {
          ...newApplication,
          jobId: newApplication.id,
        },
        {
          withCredentials: true,
        }
      );

      setApplications([
        ...applications,
        newApplication,
      ]);

      cancelApplication();
    } catch (error) {
      console.error("Failed to create application:", error);
    }
  };

  const cancelApplication = () => {
    setAddingApplication(false);
    setSelectedJob(null);
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
            defaultValue={selectedJob?.company || ""}
            required
          />
        </label>

        {/* Role row */}
        <label>
          Role
          <input
            name="role"
            placeholder="e.g. Software Engineer Intern (required)"
            defaultValue={selectedJob?.role || ""}
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
            defaultValue={selectedJob?.location || ""}
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