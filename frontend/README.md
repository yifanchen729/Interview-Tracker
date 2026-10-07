Interview Tracker
A full-stack web application for discovering job opportunities and
tracking internship/job applications in one place.

Utility includes:
- Browse job openings collected from public job-board APIs
- Search jobs by company or role
- Filter jobs by company, location, and posting date
- Sort job postings by newest
- View job posting dates and application deadlines
- Open the original job application page directly from the job table
- Track applications and their current status
- View application statistics through dashboard visualizations
- Store application and job data in MongoDB
Tech Stack
Frontend
- React
- TypeScript
- Vite
- CSS
- Axios
- Recharts
Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
Data
- Public job-board APIs, including Greenhouse job boards
Project Structure
Interview-tracker-project/
├── frontend/        # React + TypeScript frontend
├── backend/         # Node.js + Express backend
└── README.md
How It Works
The backend retrieves and stores job posting data from public job-board
APIs. Express provides API endpoints that allow the React frontend to
retrieve the stored jobs.
When the job listings page loads, the frontend requests the available
jobs from the backend. The returned jobs are stored in React state.
Search and filter operations are then performed on the client, so
changing filters does not require repeatedly requesting the same job
data from the backend.
Public Job APIs
      ↓
Node.js / Express
      ↓
MongoDB
      ↓
REST API
      ↓
React / TypeScript
      ↓
Job Search & Application Tracker
Getting Started
Prerequisites
Make sure you have installed:
- Node.js
- npm
- MongoDB or a MongoDB Atlas database
1. Clone the repository
git clone <your-repository-url>
cd Interview-tracker-project
2. Install frontend dependencies
cd frontend
npm install
3. Install backend dependencies
cd ../backend
npm install
4. Configure environment variables
Create a .env file inside the backend directory and add the
environment variables required by the server, such as your MongoDB
connection string.
IMPORTANT: If commit to git, do not commit the .env file as it contains credentials.
Example:
MONGO_URI=your_mongodb_connection_string
5. Start the backend
From the backend directory:
npm start
6. Start the frontend
From the frontend directory:
npm run dev
Open the local URL displayed by Vite in your browser.
Current Development
This project is actively being developed. Planned improvements include
1. Expanding job-source coverage
2. Improving filtering and search
3. More and better visual information in job application table
4. Deploying the full-stack application
5. Implement AI features (including suggesting relevant job and job seeking advise)
Author
YiFan Chen
