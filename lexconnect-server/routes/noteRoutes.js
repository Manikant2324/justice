const express = require('express');
const router = express.Router();
const { getCaseNotes, createNote } = require('../controllers/noteController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/:caseId/notes', authorize('lawyer', 'admin'), getCaseNotes);
router.post('/:caseId/notes', authorize('lawyer', 'admin'), createNote);

module.exports = router;
