import type { Application } from "../data/ApplicationArray"
import './Details.css'

// Define prop
type DetailsProp = {
  applications: Application[];
};

// Main function
export function Details({applications} : DetailsProp) {

  // Counter that goes through application array
  let applicationNum = 0;
  let interviewingNum = 0;
  let offerNum = 0;
  let rejectedNum = 0;

  applications.forEach((application) => {
    const status = application.status;
    if (status === "Interviewing")
      interviewingNum++;
    else if (status === "Offer")
      offerNum++;
    else if (status === "Rejected")
      rejectedNum++;

    applicationNum++;
  });

  // Information regarding each type
  const details = [
    { label: 'Total Applications', value: applicationNum, color: "blue"},
    { label: 'Upcoming Interviews', value: interviewingNum, color: "blue"},
    { label: 'Offers', value : offerNum, color: "green"},
    { label: 'Rejections', value: rejectedNum, color: "red"}
  ];

  // Display it with html
  return (
    <div className="details-grid">
      {/* Maps each object in the array to a grid*/}
      {details.map(detail => (
        <div className="details-card" key={detail.label}>
          {/* The icon */}
          <div className={`details-icon ${detail.color}`}>
  
          </div>
          {/* Display the text */}
          <div className="details-info">
            <p className="details-label">
              {detail.label}
            </p>
            <p className="details-value">
              {detail.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
