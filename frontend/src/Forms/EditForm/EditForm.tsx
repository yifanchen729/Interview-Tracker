import type { Application } from "../../data/ApplicationArray"
import "./EditForm.css";

// Props
type ApplicationFormProp = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  setEditingApplication: React.Dispatch<React.SetStateAction<boolean>>;
  editingApplicationID: string;
};

export function EditForm({ applications, setApplications, setEditingApplication, editingApplicationID}: ApplicationFormProp) {
  const currentApplication = applications.find((app) => {
    return app.id === editingApplicationID;
  })
  
  // For submit the application
  const submitApplication = (event: React.SubmitEvent<HTMLFormElement>) => {

    // This prevents auto refresh after submit form (old mechanic)
    event.preventDefault();

    // Get data from the form
    const formData = new FormData(event.currentTarget);

    // Create new application object
    // "as string" is to prevent TSX alarm
    const newApplication = {
      id: crypto.randomUUID(),
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      status: formData.get("status") as string,
      nextStep: formData.get("nextStep") as string,
      date: formData.get("date") as string,
      location: formData.get("location") as string,
    };

    // Change this specific object to the array
    setApplications(
      applications.map((app) => {
        if (app.id !== editingApplicationID)
          return app;
        else
          return newApplication;
      })
    )

    // This actual means done with application
    cancelApplication();
  };

  const cancelApplication = () => {
    setEditingApplication(false);
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
            <p className="main-title">UPDATE APPLICATION</p>
            <p className="sub-title">Edit application</p>
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
            defaultValue={currentApplication!.company}
            required
          />
        </label>

        {/* Role row */}
        <label>
          Role
          <input
            name="role"
            placeholder="e.g. Software Engineer Intern (required)"
            defaultValue={currentApplication!.role}
            required
          />
        </label>

        {/* Status and date row */}
        <div className="form-row">
          <label>
            Status
            {/* Select make it a drop down menu */}
            <select name="status"
              defaultValue={currentApplication!.status}
            >
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
              defaultValue={currentApplication!.date}
            />
          </label>
        </div>

        {/* Next step row */}
        <label>
          Next step
          <input
            name="nextStep"
            placeholder="Technical interview, follow-up..."
            defaultValue={currentApplication!.nextStep}
          />
        </label>

        {/* Location row */}
        <label>
          Location
          <input
            name="location"
            placeholder="Remote or city (required)"
            defaultValue={currentApplication!.location}
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
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}