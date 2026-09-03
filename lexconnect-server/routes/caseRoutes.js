const express = require('express');
const router = express.Router();
const { createCase, getCases, getCaseById, updateCaseStatus } = require('../controllers/caseController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('client'), createCase);
router.get('/', getCases);
router.get('/:id', getCaseById);
router.patch('/:id/status', authorize('lawyer', 'admin'), updateCaseStatus);

module.exports = router;
