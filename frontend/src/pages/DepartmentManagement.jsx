import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import { useSocket } from '../context/SocketContext'
import DepartmentTable from '../components/DepartmentTable'

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([])
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')
  const [editing, setEditing] = useState(null)

  useEffect(() => { load() }, [])

  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    function onCreated(dept) { setDepartments(prev => [dept, ...prev]) }
    function onUpdated(dept) { setDepartments(prev => prev.map(d => (d._id === dept._id ? dept : d))) }

    socket.on('departments:created', onCreated)
    socket.on('departments:updated', onUpdated)

    return () => {
      socket.off('departments:created', onCreated)
      socket.off('departments:updated', onUpdated)
    }
  }, [socket])

  async function load() {
    const res = await api.get('/api/departments')
    setDepartments(res.data || [])
  }

  async function submit(e) {
    e.preventDefault()
    try {
      if (editing) {
        await api.put(`/api/departments/${editing._id}`, { name, budgetAmount: Number(budget) })
      } else {
        await api.post('/api/departments', { name, budgetAmount: Number(budget) })
      }
      setName('')
      setBudget('')
      setEditing(null)
      await load()
    } catch (err) {
      console.error(err)
    }
  }

  function handleEdit(d) {
    setEditing(d)
    setName(d.name)
    setBudget(d.budgetAmount ?? d.budget ?? '')
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-3">{editing ? 'Edit Department' : 'Add Department'}</h3>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-sm text-slate-600">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Budget</label>
              <input value={budget} onChange={e => setBudget(e.target.value)} className="w-full px-3 py-2 border rounded" type="number" required />
            </div>
            <div className="text-right">
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">{editing ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      </div>

      <div>
        <DepartmentTable departments={departments} onEdit={handleEdit} />
      </div>
    </div>
  )
}
