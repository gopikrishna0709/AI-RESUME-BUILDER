const jwt = require('jsonwebtoken');
const User = require('../models/User');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'ai_resume_builder_jwt_secret_token_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, title, targetRole } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      title: title?.trim() || 'Software Engineer',
      targetRole: targetRole?.trim() || title?.trim() || 'Full Stack Developer',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to create your account right now. Please try again.',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password.',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to sign in right now. Please try again.',
    });
  }
};

// @desc    One-Click Demo Login
// @route   POST /api/auth/demo
// @access  Public
exports.demoLogin = async (req, res) => {
  try {
    let demoUser = await User.findOne({ email: 'demo.developer@resumai.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Rivera',
        email: 'demo.developer@resumai.com',
        password: 'Password123!',
        title: 'Senior Full Stack Engineer',
        targetRole: 'Staff Software Engineer',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Tailwind CSS', 'Docker', 'GraphQL'],
        experienceLevel: 'Senior Level',
      });
    }

    const token = generateToken(demoUser._id);

    res.json({
      success: true,
      token,
      user: {
        id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        title: demoUser.title,
        targetRole: demoUser.targetRole,
        experienceLevel: demoUser.experienceLevel,
      },
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during demo login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, title, targetRole, experienceLevel, skills } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (title) user.title = title;
    if (targetRole) user.targetRole = targetRole;
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (skills) user.skills = skills;

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
