const express = require('express');
const morgan = require('morgan');
// const cors = require('cors');
const app = express();

// Middlewares
// app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/users', require('./routes/userRoutes'));
// // app.use(...) more routes;
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // logs method, route, status, response time
  }

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;
