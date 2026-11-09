import { memo, useCallback, useEffect, useState } from "react";

import type { Application, ApplicationDraft } from "../data/ApplicationArray";
import type { Job } from "../data/Job";

import "./newApplications.css";

type NewApplicationsProps = {
  apps: Job[];
  applications: Application[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setAddingApplication: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedJob: React.Dispatch<
    React.SetStateAction<ApplicationDraft | null>
  >;
};

export const NewApplications = memo(function NewApplications(
  { apps, applications, search, setSearch, setAddingApplication, setSelectedJob }: NewApplicationsProps
) {

  const [company, setCompany] = useState("All Companies");
  const [location, setLocation] = useState("All Locations");
  const [datePosted, setDatePosted] = useState("Date Posted");

  const [filteredApps, setFilteredApps] = useState<typeof apps>([]);

  // Currently doing this
  const applyFilters = useCallback((jobList = apps) => {
    let result = [...jobList];


    // Search
    if (search !== "") {
      // Split the search into keywords, separated by spaces or commas
      const keywords = search
        .trim()
        .toLowerCase()
        .split(/[\s,]+/)
        .filter(Boolean);

      // Keep jobs that contain every keyword
      keywords.forEach((keyword) => {
        result = result.filter((app) => {
          return (
            app.company.toLowerCase().includes(keyword) ||
            app.role.toLowerCase().includes(keyword)
          );
        });
      });
    }

    // Company
    if (company !== "All Companies") {
      result = result.filter((app) =>
        app.company === company
      );
    }

    // Location
    if (location !== "All Locations") {
      result = result.filter((app) =>
        app.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Date
    const now = new Date();

    if (datePosted === "Last 24 Hours") {
      const cutoff = new Date();
      cutoff.setHours(now.getHours() - 24);

      result = result.filter((app) =>
        new Date(app.publishedAt) >= cutoff
      );
    }

    if (datePosted === "Last 7 Days") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 7);

      result = result.filter((app) =>
        new Date(app.publishedAt) >= cutoff
      );
    }

    if (datePosted === "Last 30 Days") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 30);

      result = result.filter((app) =>
        new Date(app.publishedAt) >= cutoff
      );
    }

    if (datePosted === "Newest") {
      result.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      );
    }

    const trackedIds = new Set(
      applications.map(application => application.id)
    );

    result = result.filter(
      application => !trackedIds.has(application.id)
    );

    setFilteredApps(result);
  }, [applications, apps, search, company, location, datePosted]);

  // There is a warning (Solving this will take too much time, since it currently does not influence
  // product, leave it as it is)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="new-applications-table-container">
      <div className="applications-table-header">
        {/* Fixed header */}
        <div className="table-header-title">New applications</div>
        {/* Use function to get right num of current filter */}
        <div className="table-header-number-shown">
          {Math.min(100, filteredApps.length)} of {filteredApps.length} shown
        </div>
      </div>

      <div className="job-filters">
        <div className="job-filters-filter-section">
          <div className="search-box">
            <img src="/search_icon.svg" className="search-box-icon" />
            <input
              className="search-box-input"
              placeholder="Search companies or roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  applyFilters();
                }
              }}
            />
          </div>

          <select
            className="job-filter-select"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            <option>All Companies</option>
            <option>Stripe</option>
            <option>Airbnb</option>
            <option>Datadog</option>
            <option>Figma</option>
          </select>

          <select
            className="job-filter-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option>All Locations</option>
            <option>Remote</option>
            <option>California</option>
            <option>Texas</option>
            <option>New York</option>
            <option>Florida</option>
            <option>Georgia</option>
            <option>Ohio</option>
            <option>Illinois</option>
            <option>Pennsylvania</option>
            <option>North Carolina</option>
            <option>Michigan</option>
          </select>

          <select
            className="job-filter-select"
            value={datePosted}
            onChange={(e) => setDatePosted(e.target.value)}
          >
            <option>Date Posted</option>
            <option>Newest</option>
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="table-scroll-container">
        <table className="table-content">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Location</th>
              <th>Published</th>
              <th>Deadline</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {/* Map each application into a row */}
            {filteredApps.slice(0, 100).map((app) => {
              // Return is need, else use () to make it on same line as .map
              return (
                // The company column
                <tr key={app.id}>
                  <td>
                    <div className="company-column">
                      <div className="company-image">{app.company[0]}</div>
                      <strong>{app.company}</strong>
                    </div>
                  </td>

                  {/* The role column */}
                  <td>{app.role}</td>

                  {/* The location column */}
                  <td>{app.location}</td>

                  {/* The posted column */}
                  <td>{new Date(app.publishedAt).toLocaleDateString()}</td>

                  {/* The posted column */}
                  <td>
                    {app.deadlineAt !== "None"
                      ? new Date(app.deadlineAt).toLocaleDateString()
                      : app.deadlineAt}
                  </td>

                  {/* The active column */}
                  <td className="newApplication-active-column">
                    <a className="add-button-link" target="_blank" href={app.url}>
                      <button className="add-button" onClick={() => { }}>
                        Apply
                      </button>
                    </a>
                    <button className="add-button add-application-button"
                      onClick={() => {
                        setSelectedJob({
                          id: app.id,
                          company: app.company,
                          role: app.role,
                          location: app.location,
                        });

                        setAddingApplication(true)
                      }}
                    >
                      + Track
                    </button>
                  </td>
                </tr>
              );
            })}

            {/* If no application in the filtered list, do this */}
            {!filteredApps.length && (
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
    </div >
  );
});