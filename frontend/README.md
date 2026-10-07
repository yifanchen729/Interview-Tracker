# Interview Tracker

Interview Tracker is a full-stack web application for discovering job opportunities and tracking internship and job applications in one place.

The application collects job postings from public job-board APIs and provides an interface for searching and filtering opportunities. It also allows users to track their applications, deadlines, statuses, and application statistics.

## Features

- Browse job openings collected from public job-board APIs
- Search jobs by company or role
- Filter jobs by company, location, and posting date
- Sort job postings by newest
- View posting dates and application deadlines
- Open original job postings directly from the application
- Track job applications and their current status
- View application statistics through dashboard visualizations
- Store job and application data in MongoDB

## Technology

The frontend is built with **React**, **TypeScript**, and **Vite**. **Axios** is used to communicate with the backend API, and **Recharts** is used for application data visualizations.

The backend is built with **Node.js** and **Express.js**. Application and job data are stored in **MongoDB** and accessed through **Mongoose**.

Job posting data is collected from public job-board APIs, including Greenhouse job boards.

## Project Structure

```text
Interview-tracker-project/
├── frontend/        # React and TypeScript frontend
├── backend/         # Node.js and Express backend
└── README.md
```

## Local Development

### Prerequisites

Before running the project, make sure you have:

- Node.js
- npm
- MongoDB or a MongoDB Atlas database

### Clone the repository

```bash
git clone <your-repository-url>
cd Interview-tracker-project
```

### Backend

Install the backend dependencies:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory and add your MongoDB connection string:

```env
MONGO_URI=your_mongodb_connection_string
```

The `.env` file contains credentials and should **not** be committed to Git.

Start the backend:

```bash
npm start
```

### Frontend

In a separate terminal, install the frontend dependencies:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## How It Works

The backend collects job postings from public job-board APIs and stores the normalized job data in MongoDB. Express provides REST API endpoints that allow the React frontend to retrieve the stored jobs.

The frontend retrieves the available jobs when the job listings page loads. Search, filtering, and sorting can then be performed on the retrieved data without repeatedly requesting the same data from the backend.

```text
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
```

## Future Development

Planned improvements include:

- Expanding job-source coverage
- Improving job search and filtering
- Adding more visual information to application tracking
- Deploying the full-stack application
- Exploring AI features for job recommendations and job-search guidance

## Author

**YiFan Chen**
