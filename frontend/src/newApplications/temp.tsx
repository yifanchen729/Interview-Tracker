export function NewApplications() {
  return (
    <section className="job-table-container">

      Top section
      <div className="job-table-header">
        <div>
          <h2>Job Openings</h2>
          <p>Browse and track available opportunities</p>
        </div>

        <div className="job-count">
          1,240 jobs
        </div>
      </div>


      {/* Filters */}
      <div className="job-filters">

        {/* Company */}
        <select className="job-filter-select">
          <option>All Companies</option>
          <option>Stripe</option>
          <option>Airbnb</option>
          <option>Datadog</option>
          <option>Figma</option>
        </select>

        {/* Location */}
        <select className="job-filter-select">
          <option>All Locations</option>
          <option>Remote</option>
          <option>San Francisco</option>
          <option>New York</option>
          <option>Seattle</option>
        </select>

        {/* Status */}
        <select className="job-filter-select">
          <option>All Statuses</option>
          <option>To Apply</option>
          <option>Applied</option>
          <option>Interviewing</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        {/* Date */}
        <select className="job-filter-select">
          <option>Date Posted</option>
          <option>Newest</option>
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>


      {/* Scrollable table */}
      <div className="job-table-scroll">

        <table className="job-table">

          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Location</th>
              <th>Posted</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {/* Example row */}
            <tr>
              <td>
                <div className="job-company">
                  <div className="job-company-icon">
                    S
                  </div>

                  <strong>Stripe</strong>
                </div>
              </td>

              <td>
                <div className="job-role">
                  Software Engineer Intern
                </div>
              </td>

              <td>
                San Francisco, CA
              </td>

              <td>
                Sep 25, 2026
              </td>

              <td>
                None
              </td>

              <td>
                <span className="job-status to-apply">
                  To Apply
                </span>
              </td>

              <td>
                <a
                  className="job-apply-button"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply
                </a>
              </td>
            </tr>


            {/* Another example */}
            <tr>
              <td>
                <div className="job-company">
                  <div className="job-company-icon">
                    A
                  </div>

                  <strong>Airbnb</strong>
                </div>
              </td>

              <td>
                <div className="job-role">
                  Backend Engineer
                </div>
              </td>

              <td>
                Remote
              </td>

              <td>
                Sep 20, 2026
              </td>

              <td>
                Oct 20, 2026
              </td>

              <td>
                <span className="job-status applied">
                  Applied
                </span>
              </td>

              <td>
                <a
                  className="job-apply-button"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply
                </a>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </section>
  )
}