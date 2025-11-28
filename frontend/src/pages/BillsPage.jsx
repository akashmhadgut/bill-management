import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import { formatINR } from '../utils/currency'
import BillForm from '../components/BillForm'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

export default function BillsPage() {
  const [bills, setBills] = useState([])
  const [editing, setEditing] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const { user } = useAuth()

  useEffect(() => { load() }, [])

  // subscribe to real-time events
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    function onCreated(bill) {
      setBills(prev => [bill, ...prev])
    }
    function onUpdated(bill) {
      setBills(prev => prev.map(b => (b._id === bill._id ? bill : b)))
    }
    function onDeleted(payload) {
      setBills(prev => prev.filter(b => b._id !== payload.id))
    }
    function onApproved(bill) { onUpdated(bill) }
    function onRejected(bill) { onUpdated(bill) }

    socket.on('bills:created', onCreated)
    socket.on('bills:updated', onUpdated)
    socket.on('bills:deleted', onDeleted)
    socket.on('bills:approved', onApproved)
    socket.on('bills:rejected', onRejected)

    return () => {
      socket.off('bills:created', onCreated)
      socket.off('bills:updated', onUpdated)
      socket.off('bills:deleted', onDeleted)
      socket.off('bills:approved', onApproved)
      socket.off('bills:rejected', onRejected)
    }
  }, [socket])

  async function load() {
    try {
      const res = await api.get('/api/bills')
      setBills(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this bill?')) return
    try {
      await api.delete(`/api/bills/${id}`)
      await load()
    } catch (err) { console.error(err) }
  }

  async function approve(id) {
    try { await api.put(`/api/bills/approve/${id}`); await load() } catch (err) { console.error(err) }
  }

  async function reject(id) {
    try { await api.put(`/api/bills/reject/${id}`); await load() } catch (err) { console.error(err) }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Bills</h2>
        {user?.role === 'leader' && <button onClick={() => { setEditing(null); setShowNew(!showNew) }} className="px-3 py-1 bg-emerald-600 text-white rounded">{showNew ? 'Close' : 'Create Bill'}</button>}
      </div>

      {user && user.role !== 'admin' && (
        <div className="text-sm text-slate-500 mb-3">Showing bills for <strong>{user?.department?.name || user?.department || 'your department'}</strong></div>
      )}

      {showNew && user?.role === 'leader' && (
        <div className="mb-4"><BillForm onSaved={() => { setShowNew(false); load() }} /></div>
      )}

      {editing && <div className="mb-4"><BillForm initial={editing} onSaved={() => { setEditing(null); load() }} /></div>}

      <div className="bg-white rounded border overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(b => (
              <tr key={b._id} className="border-t">
                <td className="px-4 py-2">{b.title}</td>
                <td className="px-4 py-2">{formatINR(b.amount)}</td>
                <td className="px-4 py-2">{b.department?.name || b.department}</td>
                <td className="px-4 py-2">{b.createdBy?.name || b.createdBy?.email || (b.createdBy||'')}</td>
                <td className="px-4 py-2">{b.status}</td>
                <td className="px-4 py-2 space-x-2">
                  {user?.role === 'leader' && <button onClick={() => setEditing(b)} className="px-2 py-1 bg-amber-500 text-white rounded">Edit</button>}
                  {user?.role === 'admin' && <>
                    <button onClick={() => approve(b._id)} className="px-2 py-1 bg-emerald-600 text-white rounded">Approve</button>
                    <button onClick={() => reject(b._id)} className="px-2 py-1 bg-rose-500 text-white rounded">Reject</button>
                    <button onClick={() => remove(b._id)} className="px-2 py-1 bg-slate-700 text-white rounded">Delete</button>
                  </>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
