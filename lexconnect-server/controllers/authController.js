const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'lexconnect_secret_key_2026', {
    expiresIn: '365d'
  });
};

// @desc    Register a new user (Client or Lawyer)
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, specialization, experienceYears, avatar } = req.body;

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPassword = password ? password.trim() : '';

    if (!cleanEmail || !cleanPassword || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required fields.' });
    }

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email address already exists. Please sign in.' });
    }

    // Role safety check: Admin registration is not allowed via public register
    const userRole = (role === 'lawyer') ? 'lawyer' : 'client';

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: cleanPassword,
      role: userRole,
      phone: phone ? phone.trim() : '',
      specialization: userRole === 'lawyer' ? (specialization || 'General Legal Counsel') : '',
      experienceYears: userRole === 'lawyer' ? (experienceYears || 5) : 0,
      avatar: avatar || (userRole === 'lawyer'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300')
    });

    console.log(`[Auth Register Success] New ${userRole} account created for ${cleanEmail}`);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      specialization: user.specialization,
      avatar: user.avatar,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token (Client or Lawyer portal login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPassword = password ? password.trim() : '';

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: 'Please provide both email address and password.' });
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      console.warn(`[Auth Login Failed] Account not found for email: "${cleanEmail}"`);
      return res.status(401).json({ message: 'No account registered with this email address. Please check your credentials or register.' });
    }

    const isMatch = await user.matchPassword(cleanPassword);
    if (!isMatch) {
      console.warn(`[Auth Login Failed] Password mismatch for user: "${cleanEmail}"`);
      return res.status(401).json({ message: 'Invalid password. Please check your password and try again.' });
    }

    console.log(`[Auth Login Success] User logged in: ${cleanEmail} (Role: ${user.role})`);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      specialization: user.specialization,
      avatar: user.avatar,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({ message: error.message || 'Server error during authentication' });
  }
};

// @desc    Management / Admin Portal Login
// @route   POST /api/auth/admin-login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPassword = password ? password.trim() : '';

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: 'Please provide Director email address and password.' });
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      console.warn(`[Admin Login Failed] Director account not found: "${cleanEmail}"`);
      return res.status(401).json({ message: 'No Director account found matching this email address.' });
    }

    if (user.role !== 'admin') {
      console.warn(`[Admin Login Failed] Unauthorized role attempt by "${cleanEmail}" (Role: ${user.role})`);
      return res.status(403).json({ message: `Access Denied: Account '${cleanEmail}' exists as a ${user.role}, but does not have Directorate Admin privileges.` });
    }

    const isMatch = await user.matchPassword(cleanPassword);
    if (!isMatch) {
      console.warn(`[Admin Login Failed] Password mismatch for Director: "${cleanEmail}"`);
      return res.status(401).json({ message: 'Invalid password entered. Please verify your Director credentials.' });
    }

    console.log(`[Admin Login Success] Director logged in: ${cleanEmail}`);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('[Admin Login Error]:', error);
    res.status(500).json({ message: error.message || 'Server error during Director login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get empaneled advocates for public landing page
// @route   GET /api/auth/lawyers
// @access  Public
exports.getEmpaneledLawyers = async (req, res) => {
  try {
    const lawyers = await User.find({ role: 'lawyer' }).select('-password');
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile & avatar photo (Client, Lawyer, Admin)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.phone) user.phone = req.body.phone.trim();
    if (req.body.specialization) user.specialization = req.body.specialization;
    if (req.body.experienceYears) user.experienceYears = req.body.experienceYears;

    // Handle avatar image file upload (Cloudinary URL or file upload)
    if (req.file) {
      user.avatar = req.file.path || req.file.secure_url || `/uploads/${req.file.filename}`;
    } else if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    // Auto-sync client details JSON into their dedicated Cloudinary folder
    const upload = require('../config/upload');
    const Case = require('../models/Case');
    const userCases = await Case.find({ $or: [{ client: updatedUser._id }, { assignedLawyer: updatedUser._id }] });
    upload.syncClientDetailsToCloudinary(updatedUser, userCases);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      specialization: updatedUser.specialization,
      experienceYears: updatedUser.experienceYears,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
