const Note = require('../models/Note');

// @desc    Get private internal notes for a case
// @route   GET /api/cases/:caseId/notes
// @access  Private (Lawyer or Admin)
exports.getCaseNotes = async (req, res) => {
  try {
    const notes = await Note.find({ case: req.params.caseId })
      .populate('lawyer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add private internal note to a case
// @route   POST /api/cases/:caseId/notes
// @access  Private (Lawyer)
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      case: req.params.caseId,
      lawyer: req.user._id,
      title: title || 'Internal Case Note',
      content,
      isPrivate: true
    });

    const populated = await Note.findById(note._id).populate('lawyer', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
