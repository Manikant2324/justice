const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getLawyersWorkload,
  assignLawyerToCase,
  getClientsDirectory
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/analytics', authorize('admin'), getAnalytics);
router.get('/lawyers', getLawyersWorkload); // Admin or Clients viewing lawyers
router.get('/clients', authorize('admin'), getClientsDirectory);
router.post('/cases/:id/assign', authorize('admin'), assignLawyerToCase);

module.exports = router;
