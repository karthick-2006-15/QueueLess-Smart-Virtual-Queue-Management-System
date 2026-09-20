const express = require('express');
const queueController = require('../controllers/queueController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All queue routes require authentication
router.use(protect);

router.post('/join', queueController.joinQueue);
router.get('/my-active', queueController.getMyActiveQueue);
router.get('/history', queueController.getMyQueueHistory);
router.delete('/:id', queueController.cancelQueue);

// Staff operations
router.post('/staff/next', authorize('STAFF', 'ADMIN'), queueController.callNext);

module.exports = router;
