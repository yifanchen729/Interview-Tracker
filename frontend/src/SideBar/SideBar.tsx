import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import './SideBar.css';

// All current available button
const sideBarButtonNames = ['Dashboard', 'Apply', 'Statistics'];

type User = {
  _id: string;
  googleId: string;
  email: string;
  name?: string;
  picture?: string;
};

// Define props
type SideBarProps = {
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};
// Main function
export function SideBar({
  activePage,
  setActivePage,
  user,
  setUser,
}: SideBarProps) {

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    // The entire side bar
    <aside className="sidebar">
      {/* The title/brand at the top */}
      <div className="sidebar-top">
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
      </div>

      {/* The setting at the bottom */}
      <div className="sidebar-bottom">
        {user ? (
          // User is logged in
          <>
            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

            <div className="user-info">
              {user.picture && (
                <img
                  src={user.picture}
                  // src={'https://lh3.googleusercontent.com/a/ACg8ocJ-6ylX_JWGX9vm9lk0EHRFzb4t-LhhP30RHYmcaROhcIUV2SY=s96-c'}
                  className="user-picture"
                />
              )}

              <div className="user-details">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          </>
        ) : (
          // User is not logged in
          <>
            <div className="login-title"> 
              Login
            </div>

            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const response = await axios.post(
                    "http://localhost:5000/api/auth/google",
                    {
                      token: credentialResponse.credential,
                    },
                    {
                      withCredentials: true,
                    }
                  );

                  setUser(response.data.user);
                  console.log("picture:", user!.picture);
                } catch (error) {
                  console.error("Login failed:", error);
                }
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </>
        )}
      </div>
    </aside>
  );
}
