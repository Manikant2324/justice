const Case = require('../models/Case');
const TimelineEvent = require('../models/TimelineEvent');
const User = require('../models/User');

// @desc    Submit a new case (Client)
// @route   POST /api/cases
// @access  Private (Client)
exports.createCase = async (req, res) => {
  try {
    const { title, category, priority, description, preferredLocation } = req.body;

    const count = await Case.countDocuments();
    const caseNumber = `LX-${1000 + count + 1}`;

    const newCase = await Case.create({
      caseNumber,
      title,
      category,
      priority: priority || 'Medium',
      description,
      preferredLocation: preferredLocation || 'Delhi NCR',
      client: req.user._id,
      status: 'Pending Review'
    });

    // Create initial timeline event
    await TimelineEvent.create({
      case: newCase._id,
      title: 'Case Submitted',
      description: 'Case successfully submitted by client. Awaiting review from JusticeHub Directorate.',
      stage: 'Pending Review',
      createdBy: req.user._id
    });

    const populatedCase = await Case.findById(newCase._id).populate('client', 'name email phone avatar');

    res.status(201).json(populatedCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's cases (Client gets client cases, Lawyer gets assigned cases, Admin gets all)
// @route   GET /api/cases
// @access  Private
exports.getCases = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'client') {
      query = { client: req.user._id };
    } else if (req.user.role === 'lawyer') {
      query = { assignedLawyer: req.user._id };
    } else if (req.user.role === 'admin') {
      query = {}; // Admin sees all
    }

    const cases = await Case.find(query)
      .populate('client', 'name email phone avatar')
      .populate('assignedLawyer', 'name email phone specialization experienceYears avatar lawyerStatus')
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single case by ID with timeline
// @route   GET /api/cases/:id
// @access  Private
exports.getCaseById = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate('client', 'name email phone avatar bio')
      .populate('assignedLawyer', 'name email phone specialization experienceYears avatar bio lawyerStatus')
      .populate('assignedBy', 'name email');

    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Access control check
    if (
      req.user.role === 'client' && caseItem.client._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Unauthorized access to this case' });
    }

    if (
      req.user.role === 'lawyer' && (!caseItem.assignedLawyer || caseItem.assignedLawyer._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Unauthorized access to this case' });
    }

    const timeline = await TimelineEvent.find({ case: caseItem._id })
      .populate('createdBy', 'name role')
      .sort({ createdAt: 1 });

    res.json({
      ...caseItem.toObject(),
      timeline
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Case Status (Lawyer or Management)
// @route   PATCH /api/cases/:id/status
// @access  Private (Lawyer or Admin)
exports.updateCaseStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    caseItem.status = status;
    await caseItem.save();

    // Create timeline entry for status update
    await TimelineEvent.create({
      case: caseItem._id,
      title: `Status Updated: ${status}`,
      description: note || `Case progression status updated to ${status} by ${req.user.name} (${req.user.role}).`,
      stage: status,
      createdBy: req.user._id
    });

    const updated = await Case.findById(caseItem._id)
      .populate('client', 'name email phone avatar')
      .populate('assignedLawyer', 'name email phone specialization experienceYears avatar');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
