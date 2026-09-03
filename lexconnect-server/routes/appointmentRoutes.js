const express = require('express');
const router = express.Router();
const { getAppointments, createAppointment, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getAppointments);
router.post('/', createAppointment);
router.patch('/:id', updateAppointmentStatus);

module.exports = router;
