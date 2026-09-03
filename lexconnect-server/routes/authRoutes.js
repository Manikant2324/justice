const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin, getMe, updateUserProfile, getEmpaneledLawyers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../config/upload');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);
router.get('/lawyers', getEmpaneledLawyers);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);

module.exports = router;
