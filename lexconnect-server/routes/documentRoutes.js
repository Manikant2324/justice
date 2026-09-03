const express = require('express');
const router = express.Router();
const { getCaseDocuments, uploadDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const upload = require('../config/upload');

router.use(protect);

router.get('/:caseId/documents', getCaseDocuments);
router.post('/:caseId/documents', upload.single('file'), uploadDocument);

module.exports = router;
