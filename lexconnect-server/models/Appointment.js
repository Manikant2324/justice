const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true // YYYY-MM-DD
  },
  time: {
    type: String,
    required: true // e.g. "10:30 AM"
  },
  type: {
    type: String,
    enum: ['Video Call', 'In-Person Consultation', 'Phone Call', 'Court Preparation'],
    default: 'Video Call'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
