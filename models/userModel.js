const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  // Basic Profile
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true, select: false },

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
 

// Password Reset
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
    timestamps: true
  });


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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
  .createHash('sha256')     // 1. Create a SHA-256 hashing object
  .update(resetToken)       // 2. Feed the original token (random bytes) into it
  .digest('hex');           // 3. Output the final hashed string in hex format

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
