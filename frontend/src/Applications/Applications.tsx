import { useState } from 'react';
import type { Application } from "../data/ApplicationArray"
import './Applications.css'

// Types of filter
const filters = ['All', 'To Apply', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

// Define prop
type ApplicationProp = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  setEditingApplication: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingApplicationID: React.Dispatch<React.SetStateAction<string>>;
};

// Main function
export function Applications({ applications, setApplications, setEditingApplication, setEditingApplicationID }: ApplicationProp) {

  // useState to update the filter, default is "All"
  const [currentFilter, setCurrentFilter] = useState('All');

  // Function to update (Does not feel necessary to have this)
  const selectFilter = (filter: string) => {
    setCurrentFilter(filter);
  };

  // An array to count every types of application for display
  const filtersCount = [
    { name: "All", count: 0 },
    { name: "To Apply", count: 0 },
    { name: "Applied", count: 0 },
    { name: "Interviewing", count: 0 },
    { name: "Offer", count: 0 },
    { name: "Rejected", count: 0 }
  ];

  // For each application, get status and find corresponding filter object
  // in the array above, then count++
  applications.forEach((application) => {
    const status = application.status;
    const correctFilterToIncrement = filtersCount.find((filter) => {
      return filter.name === status;
    });

    correctFilterToIncrement!.count++;
    filtersCount[0].count++; // For the all filter
  });

  // Returns the application num in specific filter
  const getCorrectFilterNum = (filterInput: string) => {
    const correctFilter = filtersCount.find((filter) => {
      return filter.name === filterInput;
    });

    return correctFilter!.count;
  };

  // Get the application list that match current Filter
  const filteredApplications = applications.filter((application) => {
    return currentFilter === "All" || application.status === currentFilter;
  });

  // Delete application by not including application with specific id
  const deleteApplication = (id: string) => {
    setApplications(
      applications.filter((application) => {
        return application.id !== id;
      })
    );
  };

  return (
    // Entire table
    <section className="applications-table-container">
      {/* The header */}
      <div className="applications-table-header">
        {/* Fixed header */}
        <div className="table-header-title">
          Applications
        </div>
        {/* Use function to get right num of current filter */}
        <div className="table-header-number-shown">
          {getCorrectFilterNum(currentFilter)} shown
        </div>
      </div>

      {/* The filter section */}
      <div className="table-filters">
        {/* Create button for each filter choice */}
        {filters.map(filter => (
          <button
            key={filter}
            className={`table-filter ${currentFilter === filter ? 'active' : ''}`}
            onClick={() => { selectFilter(filter) }}
          >
            {filter} {getCorrectFilterNum(filter)}
          </button>
        ))}
      </div>

      <div className="table-scroll-container">
        {/* The actual application list */}
        <table className="table-content">

          {/* Table header */}
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Next Step / Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>

          {/* Table info */}
          <tbody>
            {/* Map each application into a row */}
            {filteredApplications.map(app => {
              // Return is need, else use () to make it on same line as .map
              return (
                // The company column
                <tr key={app.id}>
                  <td>
                    <div className="company-column">
                      <div className="company-image">
                        {app.company[0]}
                      </div>
                      <strong>{app.company}</strong>
                    </div>
                  </td>

                  {/* The role column */}
                  <td>{app.role}</td>

                  {/* The status column */}
                  <td>
                    <div className={`status-column ${app.status.toLowerCase()}`}>
                      {app.status}
                    </div>
                  </td>

                  {/* The next column */}
                  <td>
                    <div className="next-column">
                      <p className="next-column-next-step">
                        {app.nextStep}
                      </p>
                      <p className="next-column-date">
                        {app.date}
                      </p>
                    </div>
                  </td>

                  {/* The location column */}
                  <td>
                    {app.location}
                  </td>

                  {/* The active column */}
                  <td>
                    <div className="actions-column">
                      <button className="actions-column-edit" title="Edit"
                        onClick={() => {
                          setEditingApplication(true);
                          setEditingApplicationID(app.id);
                          console.log(applications);
                        }}
                      >
                        <img src="edit_icon.svg" className="edit-icon" />
                      </button>
                      <button className="actions-column-delete" title="Delete"
                        onClick={() => {
                          deleteApplication(app.id);
                        }}
                      >
                        <img src="delete_icon.svg" className="delete-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}

            {/* If no application in the filtered list, do this */}
            {!filteredApplications.length && (
              <tr>
                {/* Takes 6 column */}
                <td colSpan={6} className="no-result">
                  No applications match your search.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </section>
  );
}
