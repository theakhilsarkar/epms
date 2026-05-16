const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    week: {
      type: String,
      required: [true, 'Please provide the week (e.g., 2026-W20)'],
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // Allows dynamic objects for dynamic form data
      required: [true, 'Please provide report data'],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate submissions per user per week
reportSchema.index({ userId: 1, week: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
