import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const { token } = useAuth()
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!token) {
      // disconnect if no token
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setConnected(false)
      }
      return
    }

    // create socket with auth token
    const url = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    const s = io(url, { auth: { token } })

    function onConnect() { setConnected(true) }
    function onDisconnect() { setConnected(false) }

    s.on('connect', onConnect)
    s.on('disconnect', onDisconnect)

    setSocket(s)

    return () => {
      s.off('connect', onConnect)
      s.off('disconnect', onDisconnect)
      s.disconnect()
    }
  }, [token])

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
