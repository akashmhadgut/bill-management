import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// roles: optional array of allowed roles
export default function ProtectedRoute({ roles = [] }) {
  const { token, user } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (roles && roles.length > 0) {
    // compare roles case-insensitively
    const allowed = roles.map(r => String(r).toLowerCase())
    const current = user?.role ? String(user.role).toLowerCase() : null
    if (!user || !current || !allowed.includes(current)) {
      return <Navigate to="/login" replace />
    }
  }

  return <Outlet />
}
