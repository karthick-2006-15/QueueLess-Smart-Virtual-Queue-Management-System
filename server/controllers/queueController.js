const Queue = require('../models/Queue');
const Service = require('../models/Service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Join virtual queue
exports.joinQueue = catchAsync(async (req, res, next) => {
  const { serviceId } = req.body;
  const userId = req.user.id;

  const service = await Service.findById(serviceId);
  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  if (service.status !== 'OPEN') {
    return next(new AppError('This service counter is currently closed', 400));
  }

  // Check if user already has an active queue ticket
  const existingQueue = await Queue.findOne({
    userId,
    status: { $in: ['WAITING', 'CALLED', 'SERVING'] },
  });

  if (existingQueue) {
    return next(
      new AppError(`You already have an active queue ticket (${existingQueue.tokenNumber})`, 400)
    );
  }

  // Count active people ahead today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const totalToday = await Queue.countDocuments({
    serviceId,
    createdAt: { $gte: startOfDay },
  });

  const nextNumber = totalToday + 1;
  const tokenNumber = `${service.prefix}-${String(nextNumber).padStart(3, '0')}`;

  const peopleAhead = await Queue.countDocuments({
    serviceId,
    status: { $in: ['WAITING', 'CALLED'] },
  });

  const estimatedWait = (peopleAhead + 1) * service.averageServiceTime;

  const newQueue = await Queue.create({
    serviceId,
    userId,
    tokenNumber,
    status: 'WAITING',
    position: peopleAhead + 1,
    estimatedWait,
  });

  res.status(201).json({
    success: true,
    data: {
      queue: {
        ...newQueue.toObject(),
        serviceName: service.name,
        counterNumber: service.counterNumber,
      },
    },
  });
});

// Get user's active queue
exports.getMyActiveQueue = catchAsync(async (req, res, next) => {
  const queue = await Queue.findOne({
    userId: req.user.id,
    status: { $in: ['WAITING', 'CALLED', 'SERVING'] },
  }).populate('serviceId', 'name prefix counterNumber location averageServiceTime');

  res.status(200).json({
    success: true,
    data: { queue },
  });
});

// Get user's queue history
exports.getMyQueueHistory = catchAsync(async (req, res, next) => {
  const queues = await Queue.find({
    userId: req.user.id,
    status: { $in: ['COMPLETED', 'CANCELLED', 'SKIPPED'] },
  })
    .populate('serviceId', 'name prefix')
    .sort('-createdAt')
    .limit(20);

  res.status(200).json({
    success: true,
    data: { queues },
  });
});

// Cancel active queue
exports.cancelQueue = catchAsync(async (req, res, next) => {
  const queue = await Queue.findOne({
    _id: req.params.id,
    userId: req.user.id,
    status: { $in: ['WAITING', 'CALLED'] },
  });

  if (!queue) {
    return next(new AppError('No active queue ticket found with that ID', 404));
  }

  queue.status = 'CANCELLED';
  await queue.save();

  res.status(200).json({
    success: true,
    message: 'Queue ticket successfully cancelled',
  });
});

// Staff: Call next user
exports.callNext = catchAsync(async (req, res, next) => {
  const { serviceId } = req.body;

  // Complete any currently serving ticket
  await Queue.updateMany(
    { serviceId, status: { $in: ['SERVING', 'CALLED'] } },
    { status: 'COMPLETED', completedAt: Date.now() }
  );

  // Find next waiting
  const nextTicket = await Queue.findOne({
    serviceId,
    status: 'WAITING',
  }).sort('createdAt');

  if (!nextTicket) {
    return res.status(200).json({
      success: true,
      message: 'No more waiting tickets for this service',
      data: { queue: null },
    });
  }

  nextTicket.status = 'CALLED';
  nextTicket.calledAt = Date.now();
  await nextTicket.save();

  res.status(200).json({
    success: true,
    data: { queue: nextTicket },
  });
});
