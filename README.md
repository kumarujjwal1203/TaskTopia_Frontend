Project Report: TaskTopia – MERN Stack Task Manager App (2025)
1. Introduction
TaskTopia is a full-stack web application developed using the MERN stack — MongoDB, Express.js, React.js, and Node.js. It offers an efficient way for users to manage their day-to-day tasks with a sleek and intuitive interface. TaskTopia includes features like authentication, dynamic task handling, real-time feedback, and responsive UI, making it a complete productivity tool.
2. Technology Stack
Frontend: React.js, Tailwind CSS


Backend: Node.js, Express.js


Database: MongoDB Atlas (with Mongoose)


Authentication: JWT + bcrypt


State Management: React Hooks, Context API


Hosting: Vercel (Frontend), Render (Backend)


3. Features
Authentication & Security
User registration and login with JWT token-based authentication


Passwords hashed securely using bcrypt


Protected routes to restrict access to authenticated users



Task Management
Create, update, and delete tasks


Inputs include: Title, Description, Due Date, Priority (High/Medium/Low), and Status (Completed/Pending)


Tasks are color-coded and styled for clarity


Filtering & Sorting
Filter tasks by: Completed, Pending, Priority


Search bar for quick filtering


Sort tasks by date or priority


Real-time UX Enhancements
Auto-refresh task list on updates or deletions


Toast notifications for all actions


Smooth animations and form validation feedback


UI/UX Design
Tailwind CSS with a futuristic gradient theme (from-violet-500 via-indigo-400 to-teal-400)


Modal forms for task creation/editing


Mobile-first responsive design with collapsible sidebar and intuitive navigation


4. System Architecture
Frontend: React handles UI components, form validation, and API calls using Axios


Backend: Express.js manages RESTful routes and authentication logic


Database: MongoDB stores user accounts and their tasks securely


5. Folder Structure
Backend:
controllers/ - Logic for auth and task APIs


models/ - Mongoose schemas for User and Task


routes/ - API routes for user and task operations


middleware/ - Authentication middleware for protected routes


server.js - Server entry point


Frontend:
components/ - Reusable components like TaskCard, Navbar, Modal


pages/ - Route-specific pages (Login, Register, Dashboard, etc.)


assets/ - UI constants and helper files


App.js & index.js - App bootstrap and route handling


6. Testing
Manual UI testing across devices and browsers


Error handling tests for backend API endpoints


Real-time UX testing on modals and task update flows


7. Deployment
Frontend: Vercel


Backend: Render


Database: MongoDB Atlas


8. Future Enhancements
Dark mode UI toggle


Collaboration features (shared tasks, assign to user)


Due date notifications via email


Integration with calendar apps (Google Calendar)


Export tasks as PDF or Excel




9. Frontend Route Design 
Route
Purpose
Logic
Packages Used
/register
Registration page
Show form for name, email, password. On submit → POST to API.
react-router-dom, axios, react-toastify
/login
Login page
Form for email & password. On submit → POST to API. Save JWT.
react-router-dom, axios, react-toastify
/
Home/Dashboard (Protected)
If token exists → fetch tasks. Else → redirect to /login.
react-router-dom, axios, localStorage, lucide-react
/profile
User profile page
Fetch user data. Allow updates. Option to logout.
react-router-dom, axios, react-toastify
/create-task
Create new task
Show form for new task. Submit → POST request to API.
react-router-dom, axios, react-toastify
/edit-task/:id
Edit existing task
Pre-fill form with task data. Submit → PUT request to API.
react-router-dom, axios, react-toastify



10. Backend API Endpoint Design 
Endpoint
Purpose
Logic
Packages Used
POST /api/user/register
Register new user
Validate input. Hash password. Save user to DB. Return token.
express, mongoose, bcryptjs, jwt
POST /api/user/login
User login
Find user. Compare password. Return token if valid.
express, mongoose, bcryptjs, jwt
GET /api/user/profile
Get current user profile
Verify token. Fetch user data from DB.
express, jwt, mongoose
POST /api/tasks
Create new task
Verify token. Validate task input. Save to DB.
express, mongoose, jwt
GET /api/tasks
Get all tasks of user
Auth required. Query DB for tasks belonging to user.
express, mongoose, jwt
GET /api/tasks/:id
Get task by ID
Find task by ID. Return if exists.
express, mongoose
PUT /api/tasks/:id
Update task
Verify token. Find and update task fields.
express, mongoose, jwt
DELETE /api/tasks/:id
Delete task
Auth required. Remove task from DB.
express, mongoose, jwt








11. Conclusion
TaskTopia demonstrates efficient use of the MERN stack in building a scalable, responsive, and user-friendly task manager. It is designed for individuals seeking simplicity and effectiveness in task management with secure login, clean UI, and advanced filtering.
