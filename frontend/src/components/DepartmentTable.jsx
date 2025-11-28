import React from 'react'
import { formatINR } from '../utils/currency'

export default function DepartmentTable({ departments = [], onEdit }) {
  return (
    <div className="bg-white rounded border overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-700">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Budget</th>
            <th className="px-4 py-3">Used</th>
            <th className="px-4 py-3">Remaining</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr className="border-t" key={d._id}>
              <td className="px-4 py-2">{d.name}</td>
              <td className="px-4 py-2">{formatINR(d.budgetAmount ?? d.budget ?? 0)}</td>
              <td className="px-4 py-2">{formatINR(d.usedAmount ?? d.used ?? 0)}</td>
              <td className="px-4 py-2">{formatINR((d.budgetAmount ?? d.budget ?? 0) - (d.usedAmount ?? d.used ?? 0))}</td>
              <td className="px-4 py-2">
                <button onClick={() => onEdit && onEdit(d)} className="px-3 py-1 bg-amber-500 text-white rounded">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
