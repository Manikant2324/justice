const Appointment = require('../models/Appointment');
const Case = require('../models/Case');

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'client') query = { client: req.user._id };
    else if (req.user.role === 'lawyer') query = { lawyer: req.user._id };
    else if (req.user.role === 'admin') query = {};

    const appointments = await Appointment.find(query)
      .populate('case', 'caseNumber title category')
      .populate('client', 'name email phone avatar')
      .populate('lawyer', 'name email phone specialization avatar')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book / Schedule an appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    const { caseId, lawyerId, title, date, time, type, notes } = req.body;

    const caseItem = await Case.findById(caseId);
    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const assignedLawyer = lawyerId || caseItem.assignedLawyer;
    if (!assignedLawyer) {
      return res.status(400).json({ message: 'No lawyer assigned to this case yet' });
    }

    const appointment = await Appointment.create({
      case: caseId,
      client: caseItem.client,
      lawyer: assignedLawyer,
      title: title || 'Legal Consultation',
      date,
      time,
      type: type || 'Video Call',
      notes: notes || '',
      status: 'Scheduled'
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('case', 'caseNumber title')
      .populate('client', 'name email avatar')
      .populate('lawyer', 'name email specialization avatar');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id
// @access  Private
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
