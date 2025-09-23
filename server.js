const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/userRoutes');
const collaboratorRoutes = require("./routes/collaborators");


app.use(cors());

// Connect DB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", collaboratorRoutes);

app.get('/api/health', (req, res) =>{
    res.json({status:"ok"});
})

app.listen(port, () =>{
    console.log(`Backend running on http://localhost:${port}`);
})