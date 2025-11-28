import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <div className="w-full bg-white border-b py-3 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-semibold">Bill Management</h1>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="text-sm text-slate-600">{user.name || user.email} — <span className="capitalize">{user.role}</span></div>
            <button onClick={logout} className="text-sm px-3 py-1 rounded bg-rose-500 text-white">Logout</button>
          </>
        ) : (
          <div className="text-sm text-slate-600">Not signed in</div>
        )}
      </div>
    </div>
  )
}
