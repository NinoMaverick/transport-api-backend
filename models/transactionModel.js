const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['debit', 'credit'], // e.g., 'debit' for ride payments, 'credit' for top-ups
    required: true
  },
  purpose: {
    type: String, // e.g., "Ride from Gate to Campus"
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route' // Optional — link to the route if applicable
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
