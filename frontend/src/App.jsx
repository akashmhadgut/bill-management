import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import DepartmentManagement from './pages/DepartmentManagement'
import UserManagement from './pages/UserManagement'
import BillsPage from './pages/BillsPage'
import LeaderDashboard from './pages/LeaderDashboard'
import InternDashboard from './pages/InternDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { useAuth } from './context/AuthContext'

function Layout({ children }) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 container">{children}</main>
      </div>
    </div>
  )
}

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/admin/departments" element={<Layout><DepartmentManagement /></Layout>} />
        <Route path="/admin/users" element={<Layout><UserManagement /></Layout>} />
      </Route>

      <Route element={<ProtectedRoute roles={["leader"]} />}>
        <Route path="/leader/dashboard" element={<Layout><LeaderDashboard /></Layout>} />
      </Route>

      <Route element={<ProtectedRoute roles={["intern"]} />}>
        <Route path="/intern/dashboard" element={<Layout><InternDashboard /></Layout>} />
      </Route>

      <Route element={<ProtectedRoute roles={["admin", "leader", "intern"]} />}>
        <Route path="/bills" element={<Layout><BillsPage /></Layout>} />
      </Route>

      <Route path="/" element={(user && user.role) ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  )
}
