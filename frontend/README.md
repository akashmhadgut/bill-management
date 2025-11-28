# Bill Management — Frontend

This is a Vite + React frontend for the Bill Management System. It uses Tailwind CSS, React Router and Axios.

Quick start (Windows / cmd.exe)

1. Change to front-end folder

```cmd
cd frontend
```

2. Install dependencies

```cmd
npm install
```

3. Run dev server

```cmd
npm run dev
```

The frontend expects the backend API at `http://localhost:5000` by default. You can override this by creating a `.env` file with `VITE_API_BASE`.

Implemented features
- Login page — stores JWT in localStorage, decodes role to route users
- Context-based auth using `AuthContext`
- Protected routes and role-based routing
- Admin pages: dashboard, department management, user creation
- Leader pages: create and edit bills
- Intern: view-only bills
- Shared components: `Navbar`, `Sidebar`, `ProtectedRoute`, `BillForm`, `DepartmentTable`

Next steps (optional)
- Add missing user-listing endpoint on the backend
- Improve styling and mobile responsiveness
- Add tests and form validation

Real-time updates
- This frontend now connects to the backend using Socket.IO when authenticated.
- It listens for events: `bills:created`, `bills:updated`, `bills:deleted`, `bills:approved`, `bills:rejected`, `departments:created`, `departments:updated`, and `users:created`.
- When these events occur, the UI updates automatically (no page refresh required).
