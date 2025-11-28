import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'
import { decodeToken } from '../utils/jwt'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => (token ? decodeToken(token) : null))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      const payload = decodeToken(token)
      // normalize role to lowercase to avoid route mismatches
      if (payload && payload.role) payload.role = String(payload.role).toLowerCase()
      setUser(payload)
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token])

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    const data = res.data
    if (data.token) {
      // set token into state/localStorage
      setToken(data.token)
      // also set user immediately from token payload
      const payload = decodeToken(data.token)
      if (payload && payload.role) payload.role = String(payload.role).toLowerCase()
      setUser(payload)
      return { ok: true, token: data.token, user: payload }
    }
    return { ok: false, error: data.message }
  }

  const logout = () => setToken(null)

  const isAuthorized = (roles = []) => {
    if (!user) return false
    if (!roles || roles.length === 0) return true
    return roles.includes(user.role)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthorized, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
