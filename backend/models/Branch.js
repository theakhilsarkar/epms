const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a branch name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
      maxlength: [100, 'Location cannot be more than 100 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Branch', branchSchema);
