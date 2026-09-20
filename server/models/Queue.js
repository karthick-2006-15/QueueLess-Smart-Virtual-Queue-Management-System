const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Queue item must belong to a service'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Queue item must belong to a user'],
    },
    tokenNumber: {
      type: String,
      required: [true, 'Queue item must have a token number'],
    },
    status: {
      type: String,
      enum: ['WAITING', 'CALLED', 'SERVING', 'COMPLETED', 'SKIPPED', 'CANCELLED'],
      default: 'WAITING',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    calledAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    estimatedWait: {
      type: Number,
      default: 0,
    },
    position: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Queue = mongoose.model('Queue', queueSchema);
module.exports = Queue;
