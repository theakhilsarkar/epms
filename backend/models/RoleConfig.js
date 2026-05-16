const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, 'Please add a label for the field'],
  },
  type: {
    type: String,
    required: [true, 'Please specify the field type'],
    enum: ['number', 'text', 'date'],
  },
  target: {
    type: Number,
    // Optional field for target metrics, etc.
  },
});

const roleConfigSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: [true, 'Please specify the role name'],
      unique: true,
      trim: true,
    },
    fields: [fieldSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RoleConfig', roleConfigSchema);
