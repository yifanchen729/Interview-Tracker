import { useEffect, useState } from "react";
import axios from "axios"

import "./newApplications.css";

export function NewApplications() {
  const [apps, setApps] = useState<{
    id: string;
    company: string;
    role: string;
    location: string;
    publishedAt: string;
    deadlineAt: string;
    url: string;
  }[]>([]);

  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("All Companies");
  const [location, setLocation] = useState("All Locations");
  const [datePosted, setDatePosted] = useState("Date Posted");

  const [filteredApps, setFilteredApps] = useState<typeof apps>([]);

  useEffect(() => {
    const getJobList = async () => {
      const response = await axios.get("http://localhost:5000/api/jobs");

      setApps(response.data.result);
      setFilteredApps(response.data.result);
    };

    getJobList();
  }, []);

  const applyFilters = () => {
    let result = [...apps];

    // Search
    if (search !== "") {
      result = result.filter((app) =>
        app.company.toLowerCase().includes(search.toLowerCase()) ||
        app.role.toLowerCase().includes(search.toLowerCase())
      );
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

    setFilteredApps(result);
  };

  return (
    <div className="new-applications-table-container">
      <div className="applications-table-header">
        {/* Fixed header */}
        <div className="table-header-title">Applications</div>
        {/* Use function to get right num of current filter */}
        <div className="table-header-number-shown">
          {filteredApps.length} shown
        </div>
      </div>

      <div className="job-filters">
        <div className="job-filters-filter-section">
          <div className="search-box">
            <img src="/search_icon.svg" className="search-box-icon" />
            <input
              className="search-box-input"
              placeholder="Search companies, roles, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            <option>San Francisco</option>
            <option>New York</option>
            <option>Seattle</option>
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
        <button className="job-filters-apply-filter-button"
          onClick={applyFilters}
        >
          Apply Filter
        </button>
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
            {filteredApps.map((app) => {
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
                  <td>
                    <a className="add-button-link" target="_blank" href={app.url}>
                      <button className="add-button" onClick={() => { }}>
                        Apply
                      </button>
                    </a>
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
    </div>
  );
}
