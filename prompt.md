Employee Task Dashboard Project Requirements

Project Overview: Create a professional HTML-based dashboard system for tracking employee tasks with two 
primary interfaces:
Display Dashboard: A TV-optimized view (1920x1080) showing employee tasks and company information
Administrative Backend: A comprehensive management system for tasks, employees, and client data

All data will be stored locally on the machine connected to the display TV.
Technical Stack

IMPORTANT: This and the Machine won't have admin access, so it must always be taken in consideration when making choices for packages

Frontend: HTML, JavaScript with a modern framework (React recommended)
Styling: Tailwind CSS
Animations: Framer Motion
Local Database: PostgreSQL or SQLite for local storage

Display Dashboard Specifications (Main Tab)
Layout Requirements

Optimized for 1920x1080 TV display
Responsive design not required (fixed display)

Employee Task Grid

2 columns × 4 rows (8 employee cards total)
Each card includes:

Employee photo (circular, right-aligned)
Employee name (color-coded to match employee's assigned color)
Current active task prominently displayed
Horizontally centered content
Clean, modern aesthetic



Client Showcase

Automatic carousel of circular client logos
Smooth transitions between clients
Consistent sizing of all logos

Task History Feed

Real-time updates in format: "[employee] has finished [task] for [client]"
Automatic entry upon task completion
Alternating background colors for improved readability
Limited to most recent 10-15 entries

Deadlines Section

2×3 grid layout of deadline cards
Each card features:

Left-aligned project/task title
Right-aligned date display in square container:

Bold centered day number
Month abbreviation in smaller text below


Background gradient timeline indicator
Color-coding:

Grey: Neutral (deadline >7 days away)
Yellow: Approaching (deadline 2-7 days away)
Red: Overdue (past deadline)





Upcoming Meetings

Google Calendar API integration
Display grid of 4 nearest upcoming meetings
Each meeting card includes:

Meeting title
Start time
Participant thumbnails (circular profile pictures)



Administrative Backend (Bastidores Tab)
Client Onboarding

Form with fields for:

Client company name
Start date (datepicker)
Logo upload with preview
Contract duration selector (3, 6, 12 months, custom option)
Playbook selector (dropdown of existing playbooks)


Submit button to add client to database

Playbook Management

Interface for creating standardized service workflows
Fields include:

Service name and description
Task creation interface with:

Task title and description
Employee assignment dropdown
Duration setting (weeks or custom timeframe)
Start timing (X days/weeks/months from project start)


Ability to save as template for future use



Task Entry System

Individual task creation form:

Task title and description
Assigned employee dropdown
Client selection
Deadline selection via calendar widget
Priority level


Individual deadline creation with associated tasks
Meeting scheduler with Google Calendar integration:

Title, date/time, duration
Participant selection
Description/agenda
Auto-sync with Google Calendar



Employee Management

CRUD operations for employee records
Each employee record includes:

Name
Profile picture upload with preview
Color assignment (for dashboard color-coding)
Role/position
Contact information


Simple interface for adding/editing/removing employees

Kanban Board

Visual task management board
One column per employee
Tasks displayed chronologically
Each task card shows:

Task title
Client name
Deadline
Priority indicator


Drag-and-drop functionality for:

Reordering tasks
Reassigning to different employees

Right-click or menu options for editing/deleting tasks
Status toggling (Not Started, In Progress, Complete)

Data Management
Database Schema

Employees: id, name, profile_picture, color, role, contact_info
Clients: id, name, logo, start_date, contract_duration, playbook_id
Tasks: id, title, description, employee_id, client_id, deadline, priority, status
Playbooks: id, name, description
PlaybookTasks: id, playbook_id, task_template, assigned_role, duration, start_offset
Meetings: id, title, datetime, duration, description, calendar_event_id

Data Persistence

All data stored in local PostgreSQL database
Regular automated backups
No external data storage required

Implementation Notes

Dashboard should auto-refresh periodically (every 5 minutes recommended)
TV display should operate in kiosk mode for continuous viewing
Google Calendar integration should use OAuth for secure access
Admin interface should be password protected
Database should be initialized with sample data for testing

Not Required

Mobile responsiveness
Data export functionality
Search/filter capabilities
Notification system
User permission levels (single admin level sufficient)