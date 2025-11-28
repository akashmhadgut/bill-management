const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

// REGISTER MODELS
require("./models/User");
require("./models/Department");
require("./models/Bill");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bill Management Backend Running");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));

const PORT = process.env.PORT || 5000;

// Create HTTP server and initialize sockets
const http = require('http').createServer(app)
const socketUtil = require('./utils/socket')
const io = socketUtil.init(http)

http.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// expose io globally to other modules via require('./utils/socket').getIo()
