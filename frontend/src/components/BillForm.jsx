import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function BillForm({ initial = {}, onSaved }) {
  const [title, setTitle] = useState(initial.title || '')
  const [amount, setAmount] = useState(initial.amount || '')
  const [department, setDepartment] = useState(initial.department?._id || initial.department || '')
  const [departments, setDepartments] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    async function load() {
      try {
        // fetch departments for admin users — leaders will be limited to their dept
        const res = await api.get('/api/departments')
        setDepartments(res.data || [])
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  useEffect(() => {
    // If current user is a leader, default the department to the leader's department
    if (user && user.role === 'leader') {
      const userDept = user.department?._id || user.department
      if (userDept) setDepartment(userDept)
    }
  }, [user])

  async function submit(e) {
    e.preventDefault()
    try {
      const payload = { title, amount: Number(amount), department }
      if (initial._id) {
        await api.put(`/api/bills/${initial._id}`, payload)
      } else {
        await api.post('/api/bills', payload)
      }
      onSaved && onSaved()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2 bg-white p-4 rounded border">
      <div>
        <label className="block text-sm text-slate-700">Title</label>
        <input className="w-full px-3 py-2 border rounded" value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div>
        <label className="block text-sm text-slate-700">Amount</label>
        <input type="number" className="w-full px-3 py-2 border rounded" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>

      <div>
        <label className="block text-sm text-slate-700">Department</label>
        <select className="w-full px-3 py-2 border rounded" value={department} onChange={e => setDepartment(e.target.value)} disabled={user?.role === 'leader'}>
          <option value="">- select -</option>
          {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
      </div>

      <div className="text-right">
        <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded">Save</button>
      </div>
    </form>
  )
}
