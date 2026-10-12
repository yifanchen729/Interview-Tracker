import { useState } from "react";
import './Header.css'

// Define prop  
type HeaderProps = {
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<string>>
  setAddingApplication: React.Dispatch<React.SetStateAction<boolean>>
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

// ?
const pages = [{
  title: "Dashboard",
  description: "Your internship search, at a glance."
}, {
  title: "Applications",
  description: "Your application details are here."
}, {
  title: "Calendar",
  description: "Time management is a crucial skill."
}, {
  title: "Statistics",
  description: "Your current stats."
}, {
  title: "Notes",
  description: "Some lessons learned, or something interesting."
}];

// Main function
export function Header({ activePage, setActivePage, setAddingApplication, setSearch }: HeaderProps) {

    const [headerSearch, setHeaderSearch] = useState("");

  // Loop through to find the right page that is active
  const currentPage = pages.find((page) => {
    return page.title === activePage
  });

  return (
    <div className="header">
      <div className="header-title">
        <p className="header-title-sub">
          {/* ! is used to tell tsx the var does exist */}
          {currentPage!.title}
        </p>
        <p className="header-title-main">
          {currentPage!.description}
        </p>
      </div>
      {/* The search box and add button */}
      <div className="header-option">
        <div className="search-box">
          <img src="/search_icon.svg"
            className="search-box-icon"
          />
          <input className="search-box-input" placeholder='Search companies, roles, or notes...'
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setActivePage("Applications");
                setSearch(headerSearch);
                setHeaderSearch("");
                event.currentTarget.blur();
              }
            }}
          />
        </div>
        <button
          className="add-button"
          onClick={() => setAddingApplication(true)}
        >
          <span className="add-icon">
            &#43;
          </span>
          Add Application</button>
      </div>
    </div>
  );
}