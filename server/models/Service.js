const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A service must have a name'],
      unique: true,
      trim: true,
    },
    prefix: {
      type: String,
      required: [true, 'A service must have a prefix for token generation'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 5,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'A service must have a location'],
    },
    counterNumber: {
      type: String,
      required: [true, 'A service must specify a counter number or name'],
    },
    averageServiceTime: {
      type: Number,
      required: [true, 'Please provide an average service time in minutes'],
      min: [1, 'Average service time must be at least 1 minute'],
    },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED', 'PAUSED'],
      default: 'OPEN',
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
