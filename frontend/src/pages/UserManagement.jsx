import React, { useState } from 'react'
import api from '../lib/api'
import { useSocket } from '../context/SocketContext'

export default function UserManagement() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('leader')
  const [password, setPassword] = useState('')
  const [department, setDepartment] = useState('')
  const [departments, setDepartments] = useState([])
  const [createdUsers, setCreatedUsers] = useState([])

  async function submit(e) {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/register', { name, email, password, role, department })
      setCreatedUsers(prev => [res.data.newUser, ...prev])
      setName(''); setEmail(''); setPassword(''); setDepartment('')
    } catch (err) {
      console.error(err)
    }
  }

  // load departments so admin can pick the department when creating users
  React.useEffect(() => {
    let cancelled = false
    async function loadDepts() {
      try {
        const res = await api.get('/api/departments')
        if (!cancelled) setDepartments(res.data || [])
      } catch (err) {
        console.error('Failed to load departments for user creation', err)
      }
    }
    loadDepts()
    return () => { cancelled = true }
  }, [])

  const { socket } = useSocket()

  // listen for created users (in case multiple admins use the system)
  React.useEffect(() => {
    if (!socket) return
    function onCreated(user) { setCreatedUsers(prev => [user, ...prev]) }
    socket.on('users:created', onCreated)
    return () => { socket.off('users:created', onCreated) }
  }, [socket])

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-3">Create User (Admin)</h3>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="block text-sm text-slate-600">Name</label><input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 border rounded" required /></div>
          <div><label className="block text-sm text-slate-600">Email</label><input value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" required /></div>
          <div><label className="block text-sm text-slate-600">Password</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full px-3 py-2 border rounded" required /></div>
          <div>
            <label className="block text-sm text-slate-600">Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)} className="w-full px-3 py-2 border rounded">
              <option value="leader">leader</option>
              <option value="intern">intern</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600">Department</label>
            <select value={department} onChange={e=>setDepartment(e.target.value)} className="w-full px-3 py-2 border rounded" required>
              <option value="">-- Select department --</option>
              {departments.map(d => (
                <option value={d._id} key={d._id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="text-right"><button className="px-4 py-2 bg-emerald-600 text-white rounded">Create</button></div>
        </form>
      </div>

      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-3">Created Users</h3>
        <div className="text-sm text-slate-500 mb-3">This list shows recently created users for admin; listing endpoint not implemented in backend by default.</div>
        <div className="space-y-2">
          {createdUsers.length === 0 && <div className="text-sm text-slate-400">No users created yet</div>}
          {createdUsers.map(u => (
            <div key={u._id} className="border p-2 rounded">
              <div className="font-semibold">{u.name || u.email} <span className="text-xs text-slate-500">({u.role})</span></div>
              <div className="text-xs text-slate-400">{u.email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
