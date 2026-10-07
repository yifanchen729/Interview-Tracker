import './SideBar.css';

// All current available button
const sideBarButtonNames = ['Dashboard', 'Applications', 'Statistics'];

// Define props
type SideBarProps = {
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
};

// Main function
export function SideBar({activePage, setActivePage}: SideBarProps) {
  return (
    // The entire side bar
    <aside className="sidebar">
      {/* The title/brand at the top */}
      <div className="brand">
        <span>InterviewTracker</span>
      </div>

      {/* Container for the all buttons */}
      <nav className="sidebar-buttons">
        {/* Map each buuttonName in the array above to a button element*/}
        {sideBarButtonNames.map((buttonName) => (
          <button
            key={buttonName}
            // Give class of "active" if active
            className={`nav-item ${activePage === buttonName ? 'active' : ''}`}
            onClick={() => setActivePage(buttonName)}
          >
            {/* Get image */}
            <img src={`/${buttonName.toLowerCase()}_icon.png`} alt={"can not display"}
              className="sidebar-icons"
            />
            {buttonName}
          </button>
        ))}
      </nav>

      {/* The setting at the bottom */}
      <button className="nav-item settings">
        <img src="dashboard_icon.png"
          className="sidebar-icons"
        />
        Settings (TBA)
      </button>
    </aside>
  );
}
