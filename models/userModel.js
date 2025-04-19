const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Profile
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true
  },
  phoneNumber: { type: String, required: true },
  password: { 
    type: String, 
    required: true,
    select: false
  },

  // Role
  role: {
    type: String,
    enum: ['student', 'driver', 'admin'],
    default: 'student'
  },

  // Driver-only fields
  licenseNumber: { type: String },
  assignedRoutes: [String],

  // Wallet (for student/driver)
  walletBalance: { 
    type: Number, 
    default: 0,
    min: 0
  },

  // Route Usage
  routeUsage: {
    gateToCampus: { type: Number, default: 0 },
    gateToDLI: { type: Number, default: 0 },
    campusToDLI: { type: Number, default: 0 },
    campusToGate: { type: Number, default: 0 },
    DLIToGate: { type: Number, default: 0 },
    DLIToCampus: { type: Number, default: 0 }
  },

  // Status
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });

// Password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password validation
userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Route Usage Analysis
userSchema.methods.getMostFrequentRoute = function() {
  const usage = this.routeUsage;
  let maxRoute = 'gateToCampus';
  let maxCount = usage.gateToCampus;

  for (let route in usage) {
    if (usage[route] > maxCount) {
      maxRoute = route;
      maxCount = usage[route];
    }
  }

  return { route: maxRoute, count: maxCount };
};

const User = mongoose.model('User', userSchema);
module.exports = User;
