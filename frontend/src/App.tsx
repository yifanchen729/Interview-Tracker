import { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";
import { SideBar } from "./SideBar/SideBar";
import { Header } from "./Header/Header";
import { Details } from "./Details/Details";
import { Applications } from "./Applications/Applications";
import type { ApplicationDraft, Application } from "./data/ApplicationArray";
import { ApplicationArray } from "./data/ApplicationArray";
import { ApplicationForm } from "./Forms/ApplicationForm/ApplicationForm";
import { EditForm } from "./Forms/EditForm/EditForm";
import { Charts } from "./Charts/Chart";
import { NewApplications } from "./newApplications/newApplications";
import { AIChat } from "./AIChat/AIChat";

type User = {
  _id: string;
  googleId: string;
  email: string;
  name?: string;
  picture?: string;
};

function App() {
  // useState for current page
  const [activePage, setActivePage] = useState("Dashboard");

  // useState for add application
  const [addingApplication, setAddingApplication] = useState(false);
  const [editingApplication, setEditingApplication] = useState(false);
  const [editingApplicationID, setEditingApplicationID] = useState("");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<ApplicationDraft | null>(null);

  // Create application from local storage
  const DEMO_MODE = true;

  const [applications, setApplications] = useState<Application[]>(
    DEMO_MODE
      ? new ApplicationArray().applications
      : []
  );

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            withCredentials: true,
          }
        );

        setUser(response.data.user);
      } catch {
        setUser(null);
      }
    };

    getCurrentUser();
  }, []);

  // Whenever applications changed, save to local storage
  // useEffect(() => {
  //   if (!user) return;

  //   const getApplications = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:5000/api/applications",
  //         {
  //           withCredentials: true,
  //         }
  //       );

  //       const loadedApplications: Application[] = response.data.map(
  //         // @ts-expect-error: Need type since tsx, may fix it later
  //         (app) => ({
  //           id: app.jobId,
  //           company: app.company,
  //           role: app.role,
  //           status: app.status,
  //           statusHistory: app.statusHistory,
  //           nextStep: app.nextStep,
  //           date: app.date,
  //           location: app.location,
  //         })
  //       );

  //       setApplications(loadedApplications);
  //     } catch (error) {
  //       console.error("Failed to load applications:", error);
  //     }
  //   };

  //   getApplications();
  // }, [user]);

  return (
    // Entire window
    <div className="app">
      {/* Left part */}
      <div className="app-left">
        <SideBar
          activePage={activePage}
          setActivePage={setActivePage}
          user={user}
          setUser={setUser}
        />
      </div>
      {/* Right part */}
      <div className="app-right">
        {/* Header and Details are always shown*/}
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          setAddingApplication={setAddingApplication}
          setSearch={setSearch}
        />
        <Details applications={applications} />

        <div className="different-pages">
          <div className="different-pages-left">
            {activePage === "Dashboard" && (
              <Applications
                applications={applications}
                setApplications={setApplications}
                setEditingApplication={setEditingApplication}
                setEditingApplicationID={setEditingApplicationID}
              />
            )}

            {activePage === "Apply" &&
              <NewApplications
                applications={applications}
                search={search}
                setSearch={setSearch}
                setAddingApplication={setAddingApplication}
                setSelectedJob={setSelectedJob}
              />}

            {activePage === "Statistics" && (
              <Charts applications={applications} />
            )}
          </div>
          <div className="different-pages-right">
            <AIChat
              applications={applications}
            />
          </div>
        </div>

        {/* If adding application, then render the form */}
        {addingApplication && (
          <ApplicationForm
            applications={applications}
            setApplications={setApplications}
            setAddingApplication={setAddingApplication}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
          />
        )}

        {/* If editing application, then render the form */}
        {editingApplication && (
          <EditForm
            applications={applications}
            setApplications={setApplications}
            setEditingApplication={setEditingApplication}
            editingApplicationID={editingApplicationID}
          />
        )}
      </div>
    </div>
  );
}

export default App;
