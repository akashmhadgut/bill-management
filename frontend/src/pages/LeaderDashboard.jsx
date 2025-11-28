import React, { useState } from 'react'
import BillForm from '../components/BillForm'
import BillsPage from './BillsPage'

export default function LeaderDashboard(){
  const [created, setCreated] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Leader Dashboard</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-3">Create a new bill</h3>
            <BillForm onSaved={() => { setCreated(true) }} />
            {created && <div className="mt-3 text-sm text-emerald-700">Bill created — refreshed below.</div>}
          </div>
        </div>

        <div>
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-3">Your recent bills</h3>
            <BillsPage />
          </div>
        </div>
      </div>
    </div>
  )
}
