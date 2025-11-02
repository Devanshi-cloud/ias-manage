# Task Management System - Frontend

A modern React-based task management application built with Vite.

## Features

- **Authentication**: Login and signup with JWT tokens
- **Admin Dashboard**: 
  - View statistics and charts
  - Create and manage tasks
  - Manage users
  - Export reports
- **User Dashboard**:
  - View assigned tasks
  - Update task status
  - Manage task checklists
  - Track progress

## Tech Stack

- React 18
- React Router v6
- Axios for API calls
- Recharts for data visualization
- Lucide React for icons
- Date-fns for date formatting

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Backend server running on port 8000

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create a `.env` file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update the `.env` file with your backend URL:
\`\`\`
VITE_API_URL=http://localhost:8000/api
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:3000`

## Project Structure

\`\`\`
src/
├── components/       # Reusable components
├── context/         # React context (Auth)
├── hooks/           # Custom hooks
├── pages/           # Page components
│   ├── Admin/       # Admin pages
│   ├── Auth/        # Authentication pages
│   └── User/        # User pages
├── routes/          # Route configuration
├── utils/           # Utility functions
│   ├── apiPaths.js  # API endpoints
│   ├── axiosInstance.js
│   ├── data.js      # Static data
│   ├── helper.js    # Helper functions
│   └── uploadimage.js
├── App.jsx          # Main app component
└── main.jsx         # Entry point
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Integration

The frontend connects to the Express backend API. Make sure the backend is running before starting the frontend.

Default backend URL: `http://localhost:8000/api`

## Authentication

The app uses JWT tokens stored in localStorage. Users are automatically redirected based on their role:
- Admin users → `/admin/dashboard`
- Regular users → `/user/dashboard`

## License

MIT
