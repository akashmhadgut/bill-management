import React, { useEffect, useState } from 'react'
import { formatINR } from '../utils/currency'
import api from '../lib/api'

export default function AdminDashboard() {
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    async function load() {
      const res = await api.get('/api/departments')
      setDepartments(res.data || [])
    }
    load()
  }, [])

  const totalBudget = departments.reduce((s, d) => s + (d.budgetAmount ?? d.budget ?? 0), 0)
  const totalUsed = departments.reduce((s, d) => s + (d.usedAmount ?? d.used ?? 0), 0)
  const remaining = totalBudget - totalUsed

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded border">
          <div className="text-sm text-slate-500">Total Budget</div>
            <div className="text-2xl font-semibold">{formatINR(totalBudget)}</div>
        </div>
        <div className="p-4 bg-white rounded border">
          <div className="text-sm text-slate-500">Total Used</div>
            <div className="text-2xl font-semibold">{formatINR(totalUsed)}</div>
        </div>
        <div className="p-4 bg-white rounded border">
          <div className="text-sm text-slate-500">Remaining</div>
            <div className="text-2xl font-semibold">{formatINR(remaining)}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-2">Department-wise Budget</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left bg-slate-50"><tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Budget</th><th className="px-4 py-2">Used</th><th className="px-4 py-2">Remaining</th></tr></thead>
            <tbody>
                  {departments.map(d => (
                      <tr key={d._id} className="border-t"><td className="px-4 py-2">{d.name}</td><td className="px-4 py-2">{formatINR(d.budgetAmount ?? d.budget ?? 0)}</td><td className="px-4 py-2">{formatINR(d.usedAmount ?? d.used ?? 0)}</td><td className="px-4 py-2">{formatINR((d.budgetAmount ?? d.budget ?? 0)-(d.usedAmount ?? d.used ?? 0))}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
