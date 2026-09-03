const Case = require('../models/Case');
const User = require('../models/User');
const TimelineEvent = require('../models/TimelineEvent');

// @desc    Get Management Analytics Overview
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res) => {
  try {
    const totalCases = await Case.countDocuments();
    const pendingCases = await Case.countDocuments({ status: 'Pending Review' });
    const activeCases = await Case.countDocuments({
      status: { $in: ['Lawyer Assigned', 'Under Investigation', 'Drafting & Filing', 'Court Hearing', 'In Negotiations'] }
    });
    const completedCases = await Case.countDocuments({ status: 'Completed' });
    const totalLawyers = await User.countDocuments({ role: 'lawyer' });
    const totalClients = await User.countDocuments({ role: 'client' });

    // Category breakdown
    const categoryStats = await Case.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Status breakdown
    const statusStats = await Case.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      metrics: {
        totalCases,
        pendingCases,
        activeCases,
        completedCases,
        totalLawyers,
        totalClients
      },
      categoryStats,
      statusStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Lawyers with live Workload & Case counts
// @route   GET /api/admin/lawyers
// @access  Private (Admin or Client for selection)
exports.getLawyersWorkload = async (req, res) => {
  try {
    const lawyers = await User.find({ role: 'lawyer' }).select('-password');

    const lawyersWithWorkload = await Promise.all(
      lawyers.map(async (lawyer) => {
        const activeCount = await Case.countDocuments({
          assignedLawyer: lawyer._id,
          status: { $ne: 'Completed' }
        });

        const totalHandled = await Case.countDocuments({
          assignedLawyer: lawyer._id
        });

        let workloadStatus = 'Light';
        if (activeCount >= 5) workloadStatus = 'Heavy';
        else if (activeCount >= 3) workloadStatus = 'Moderate';

        return {
          ...lawyer.toObject(),
          activeCaseCount: activeCount,
          totalCaseCount: totalHandled,
          workloadStatus
        };
      })
    );

    res.json(lawyersWithWorkload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign or Reassign Lawyer to Case (Management)
// @route   POST /api/admin/cases/:id/assign
// @access  Private (Admin)
exports.assignLawyerToCase = async (req, res) => {
  try {
    const { lawyerId, note } = req.body;

    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const lawyer = await User.findById(lawyerId);
    if (!lawyer || lawyer.role !== 'lawyer') {
      return res.status(400).json({ message: 'Invalid lawyer selected' });
    }

    const previousStatus = caseItem.status;
    const isReassignment = !!caseItem.assignedLawyer;

    caseItem.assignedLawyer = lawyer._id;
    caseItem.assignedBy = req.user._id;
    caseItem.assignmentNote = note || '';
    caseItem.assignedAt = new Date();
    
    if (caseItem.status === 'Pending Review') {
      caseItem.status = 'Lawyer Assigned';
    }
    await caseItem.save();

    // Add Timeline Event
    const eventTitle = isReassignment ? 'Lawyer Reassigned' : 'Lawyer Assigned';
    const eventDesc = isReassignment
      ? `Case reassigned to Adv. ${lawyer.name} (${lawyer.specialization}) by Management. ${note ? `Note: "${note}"` : ''}`
      : `Adv. ${lawyer.name} (${lawyer.specialization}) assigned to handle this case by Management. ${note ? `Note: "${note}"` : ''}`;

    await TimelineEvent.create({
      case: caseItem._id,
      title: eventTitle,
      description: eventDesc,
      stage: caseItem.status,
      createdBy: req.user._id
    });

    const updatedCase = await Case.findById(caseItem._id)
      .populate('client', 'name email phone avatar')
      .populate('assignedLawyer', 'name email phone specialization experienceYears avatar lawyerStatus')
      .populate('assignedBy', 'name email');

    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Clients for Admin Directory
// @route   GET /api/admin/clients
// @access  Private (Admin)
exports.getClientsDirectory = async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' }).select('-password');

    const clientsWithCases = await Promise.all(
      clients.map(async (client) => {
        const caseCount = await Case.countDocuments({ client: client._id });
        return {
          ...client.toObject(),
          totalSubmittedCases: caseCount
        };
      })
    );

    res.json(clientsWithCases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
