const Document = require('../models/Document');
const TimelineEvent = require('../models/TimelineEvent');

// @desc    Get all documents for a case
// @route   GET /api/cases/:caseId/documents
// @access  Private
exports.getCaseDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ case: req.params.caseId })
      .populate('uploadedBy', 'name role avatar')
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload document for a case (PDF, images, audio, video)
// @route   POST /api/cases/:caseId/documents
// @access  Private
exports.uploadDocument = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { title, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No document file uploaded' });
    }

    let fileUrl = req.file.path || req.file.secure_url;
    if (!fileUrl || !fileUrl.startsWith('http')) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const fileName = req.file.originalname || req.file.filename;
    const fileSize = req.file.size ? `${(req.file.size / 1024).toFixed(1)} KB` : 'Document';

    let fileType = 'pdf';
    if (req.file.mimetype.startsWith('image/')) fileType = 'image';
    else if (req.file.mimetype.startsWith('audio/')) fileType = 'audio';
    else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
    else if (req.file.mimetype === 'application/pdf') fileType = 'pdf';
    else fileType = 'document';

    const document = await Document.create({
      case: caseId,
      uploadedBy: req.user._id,
      title: title || req.file.originalname,
      category: category || 'Legal Document',
      fileUrl,
      fileName,
      fileType,
      fileSize
    });

    // Create timeline record
    await TimelineEvent.create({
      case: caseId,
      title: 'New Document Uploaded',
      description: `Document "${document.title}" (${fileType.toUpperCase()}) was uploaded by ${req.user.name}.`,
      stage: 'Document Vault',
      createdBy: req.user._id
    });

    const populated = await Document.findById(document._id).populate('uploadedBy', 'name role avatar');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
