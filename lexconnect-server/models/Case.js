const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Please add a case title'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a legal category'],
    enum: [
      'Property & Real Estate Law',
      'Corporate & Commercial Law',
      'Criminal Defense',
      'Intellectual Property',
      'Family & Matrimonial Law',
      'Civil Litigation',
      'Employment & Labor Law',
      'Taxation & Finance Law',
      'General Litigation'
    ],
    default: 'General Litigation'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: [
      'Pending Review',      // Management reviewing
      'Lawyer Assigned',     // Management assigned lawyer
      'Under Investigation', // Lawyer collecting evidence
      'Drafting & Filing',   // Legal drafting
      'Court Hearing',       // Active litigation / hearing
      'In Negotiations',     // Settlement / mediation
      'Completed',           // Resolved
      'Rejected'             // Closed / declined
    ],
    default: 'Pending Review'
  },
  description: {
    type: String,
    required: [true, 'Please describe your legal issue']
  },
  preferredLocation: {
    type: String,
    default: 'Delhi NCR'
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedLawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignmentNote: {
    type: String,
    default: ''
  },
  assignedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

CaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Case', CaseSchema);
