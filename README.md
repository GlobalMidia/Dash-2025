# Employee Task Dashboard

A professional HTML-based dashboard system for tracking employee tasks with two primary interfaces:
- **Display Dashboard**: A TV-optimized view (1920x1080) showing employee tasks and company information
- **Administrative Backend**: A comprehensive management system for tasks, employees, and client data

## Features

### Display Dashboard
- Employee Task Grid (2×4) with employee photos and current tasks
- Client Showcase carousel with smooth transitions
- Task History Feed with real-time updates
- Deadlines Section with color-coded timeline indicators
- Upcoming Meetings display with Google Calendar integration

### Administrative Backend (Bastidores)
- Client Onboarding with form for adding new clients
- Playbook Management for creating standardized service workflows
- Task Entry System for individual task creation and management
- Employee Management with CRUD operations
- Kanban Board for visual task management with drag-and-drop functionality

## Technical Stack

- **Frontend**: React.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Storage**: Browser localStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd employee-task-dashboard
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open your browser and navigate to:
```
http://localhost:1234
```

## Project Structure

```
employee-task-dashboard/
├── public/                 # Static assets
├── src/                    # Source files
│   ├── components/         # React components
│   │   ├── Admin/          # Admin interface components
│   │   └── Dashboard/      # Display dashboard components
│   ├── data/               # Mock data and storage utilities
│   ├── styles.css          # Global styles and Tailwind imports
│   ├── index.html          # HTML entry point
│   └── index.js            # JavaScript entry point
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # Project documentation
```

## Usage

### Display Dashboard

The Display Dashboard is designed to be shown on a TV display (1920x1080) in kiosk mode. It automatically refreshes every 5 minutes to show the latest data.

### Administrative Backend

Access the Admin interface by clicking on the "Admin (Bastidores)" link in the navigation bar. The Admin interface is password-protected (default password: admin123).

The Admin interface includes:
- Client Onboarding: Add new clients with their details
- Playbook Management: Create and manage standardized workflows
- Task Management: Create, edit, and delete tasks
- Employee Management: Manage employee records
- Kanban Board: Visual task management with drag-and-drop functionality

## Notes

- This dashboard is optimized for a 1920x1080 display
- All data is stored locally in the browser's localStorage
- The dashboard auto-refreshes every 5 minutes
- The Admin interface is password protected

## License

This project is licensed under the MIT License.
