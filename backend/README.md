# Bill Management — Backend

This backend runs an Express API and now includes Socket.IO for real-time events.

Install and run

```cmd
cd backend
npm install
npm run dev
```

Socket.IO
- The server exposes socket.io on the same port (http://localhost:5000) and emits events when bills/departments/users change so connected frontends receive updates in real-time.
