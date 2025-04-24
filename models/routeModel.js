const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  startLocation: {
    type: String,
    required: true,
    enum: ['Gate', 'Campus', 'DLI'], // You can expand this if needed
  },
  endLocation: {
    type: String,
    required: true,
    enum: ['Gate', 'Campus', 'DLI'],
  },
  vehicleType: {
    type: String,
    enum: ['bus', 'cab'],
    required: true,
  },
  fare: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;

// think 'Menu'