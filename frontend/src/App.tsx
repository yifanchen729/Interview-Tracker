import { useState, useEffect } from "react"

import "./App.css"
import { SideBar } from "./SideBar/SideBar"
import { Header } from "./Header/Header"
import { Details } from "./Details/Details"
import { Applications } from "./Applications/Applications"
import type { Application } from "./data/ApplicationArray"
import { ApplicationArray } from "./data/ApplicationArray"
import { ApplicationForm } from "./Forms/ApplicationForm/ApplicationForm"
import { EditForm } from "./Forms/EditForm/EditForm"
import { Charts } from "./Charts/Chart"
import { NewApplications } from "./newApplications/newApplications"

function App() {

  // useState for current page
  const [activePage, setActivePage] = useState('Dashboard');

  // useState for add application
  const [addingApplication, setAddingApplication] = useState(false);
  const [editingApplication, setEditingApplication] = useState(false);
  const [editingApplicationID, setEditingApplicationID] = useState("");

  // Create application from local storage
  const [applications, setApplications] = useState<Application[]>(() => {
    const savedApplications = localStorage.getItem("applications");

    if (savedApplications) {
      return JSON.parse(savedApplications);
    }

    // If none in local storage, use default
    return new ApplicationArray();
  });

  // Whenever applications changed, save to local storage
  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  return (
    // Entire window
    <div className="app">
      {/* Left part */}
      <div className="app-left">
        <SideBar activePage={activePage} setActivePage={setActivePage} />
      </div>
      {/* Right part */}
      <div className="app-right">
        {/* Header and Details are always shown*/}
        <Header activePage={activePage} setAddingApplication={setAddingApplication}/>
        <Details applications={applications} />
        
        { activePage === "Dashboard" &&
          (<Applications
            applications={applications}
            setApplications={setApplications}
            setEditingApplication={setEditingApplication}
            setEditingApplicationID={setEditingApplicationID}
          />)}
        
        { activePage === "Applications" &&
          <NewApplications />}
        
        { activePage === "Statistics" &&
          (<Charts
            applications={applications}
          />)}
        
        {/* If adding application, then render the form */}
        { addingApplication &&
          (<ApplicationForm
            applications={applications} 
            setApplications={setApplications}
            setAddingApplication={setAddingApplication} />)}

        {/* If editing application, then render the form */}
        { editingApplication &&
          (<EditForm
            applications={applications} 
            setApplications={setApplications}
            setEditingApplication={setEditingApplication}
            editingApplicationID={editingApplicationID}
          />)}
      </div>
    </div>
  );
}

export default App;
