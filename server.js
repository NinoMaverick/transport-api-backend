const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connection successful'))
  .catch((err) => {
    console.error('DB connection error:', err);
    process.exit(1); // Exit on failure
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
