const express = require('express');
const serviceController = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Publicly accessible routes (users need to see services)
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getService);

// Protect all routes after this middleware
router.use(protect);
// Restrict all routes after this to ADMIN only
router.use(authorize('ADMIN'));

router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
