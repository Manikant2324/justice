const Message = require('../models/Message');
const Case = require('../models/Case');

// @desc    Get all messages for a specific case
// @route   GET /api/cases/:caseId/messages
// @access  Private (Client, Lawyer, Admin)
exports.getCaseMessages = async (req, res) => {
  try {
    const { caseId } = req.params;

    const messages = await Message.find({ case: caseId })
      .populate('sender', 'name role avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message (with optional PDF, Image, Audio, Video attachment)
// @route   POST /api/cases/:caseId/messages
// @access  Private (Client or Lawyer assigned)
exports.sendMessage = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { text } = req.body;

    let fileUrl = '';
    let fileName = '';
    let fileType = 'none';
    let fileSize = '';

    if (req.file) {
      fileUrl = req.file.path || req.file.secure_url;
      if (!fileUrl || !fileUrl.startsWith('http')) {
        fileUrl = `/uploads/${req.file.filename}`;
      }

      fileName = req.file.originalname || req.file.filename;
      fileSize = req.file.size ? `${(req.file.size / 1024).toFixed(1)} KB` : 'Attachment';

      if (req.file.mimetype.startsWith('image/')) fileType = 'image';
      else if (req.file.mimetype.startsWith('audio/')) fileType = 'audio';
      else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
      else if (req.file.mimetype === 'application/pdf') fileType = 'pdf';
      else fileType = 'document';
    }

    if (!text && !fileUrl) {
      return res.status(400).json({ message: 'Message text or attachment is required' });
    }

    const message = await Message.create({
      case: caseId,
      sender: req.user._id,
      text: text || '',
      fileUrl,
      fileName,
      fileType,
      fileSize
    });

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name role avatar');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
