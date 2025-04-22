const express = require('express');
const morgan = require('morgan');
// const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Middlewares
// app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // logs method, route, status, response time
  }

// Routes
app.use('/api/v1/auth', authRoutes); // ✅ Mount the auth routes
app.use('/api/v1/users', userRoutes); // ✅ Mount the user routes

// Global error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;
