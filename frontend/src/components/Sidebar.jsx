import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
  >
    {children}
  </NavLink>
)

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <div className="w-64 bg-white border-r h-screen py-6 px-4">
      <div className="mb-4 font-semibold text-lg">Navigation</div>

      <nav className="space-y-2">
        {user?.role === 'admin' && (
          <>
            <NavItem to="/admin/dashboard">Admin Dashboard</NavItem>
            <NavItem to="/admin/departments">Departments</NavItem>
            <NavItem to="/admin/users">Users</NavItem>
            <NavItem to="/bills">Bills</NavItem>
          </>
        )}

        {user?.role === 'leader' && (
          <>
            <NavItem to="/leader/dashboard">Leader Dashboard</NavItem>
            <NavItem to="/bills">Bills</NavItem>
          </>
        )}

        {user?.role === 'intern' && (
          <>
            <NavItem to="/intern/dashboard">Intern Dashboard</NavItem>
            <NavItem to="/bills">Bills</NavItem>
          </>
        )}
      </nav>
    </div>
  )
}
