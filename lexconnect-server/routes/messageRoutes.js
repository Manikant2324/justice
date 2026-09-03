const express = require('express');
const router = express.Router();
const { getCaseMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const upload = require('../config/upload');

router.use(protect);

router.get('/:caseId/messages', getCaseMessages);
router.post('/:caseId/messages', upload.single('file'), sendMessage);

module.exports = router;
