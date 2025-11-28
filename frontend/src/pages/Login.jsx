import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { decodeToken } from '../utils/jwt'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await login(email, password)
      if (res.ok) {
        // use the returned token/user from AuthContext.login to avoid race with localStorage
        const token = res.token
        const payload = res.user || (token ? decodeToken(token) : null)
        const role = payload?.role ? String(payload.role).toLowerCase() : null
        if (!role) {
          setError('Login succeeded but account role is missing — contact admin')
          return
        }
        // navigate to role-specific dashboard (normalized)
        navigate(`/${role}/dashboard`)
      } else {
        setError(res.error || 'Login failed')
      }
    } catch (err) {
      setError('Login failed. ' + (err.message || ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Sign in to Bill Management</h2>
        {error && <div className="mb-3 text-sm text-rose-700">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-600">Email</label>
            <input required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Password</label>
            <input required value={password} type="password" onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>

          <div className="text-right">
            <button disabled={loading} className="px-4 py-2 bg-slate-800 text-white rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
          </div>
        </form>

        <div className="mt-4 text-xs text-slate-500">Use your backend accounts (admin, leader, intern) — this app talks to <code className="bg-slate-100 px-1 py-0.5 rounded">http://localhost:5000</code></div>
      </div>
    </div>
  )
}
