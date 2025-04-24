const mongoose = require('mongoose');

const rideLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['bus', 'cab'],
    required: true
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rideDate: {
    type: Date,
    default: Date.now
  }
});

const RideLog = mongoose.model('RideLog', rideLogSchema);

module.exports = RideLog;

// think 'Receipt'

// Use cases:
// Show ride history to the student.

// Drivers can see who boarded their vehicle and when.

// Admins can audit or investigate ride patterns.

// Later on, for features like ratings or feedback