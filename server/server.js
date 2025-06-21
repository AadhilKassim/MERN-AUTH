require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { default: connectDB } = require('./config/mongoDB');
const authRouter = require('./routes/authroutes');

// Initialize the Express application
const app = express();
app.use(cors({credentials: true}));
app.use(express.json());
app.use(cookieParser());

connectDB();

// API endpoints
app.get('/', (req, res) => {
  res.send('Welcome to the Auth Server');
});

// Import and use the auth routes. This will handle user registration, login, logout, and email verification.
app.use('/api/auth', authRouter);

// Set the port for the server
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
