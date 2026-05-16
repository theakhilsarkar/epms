const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const data = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data,
    });
  } catch (error) {
    res.status(error.statusCode || 400);
    throw error;
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  try {
    const data = await authService.authUser(req.body.email, req.body.password);
    res.status(200).json({
      success: true,
      message: 'User authenticated successfully',
      data,
    });
  } catch (error) {
    res.status(error.statusCode || 401);
    throw error;
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  try {
    const data = await authService.getProfile(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data,
    });
  } catch (error) {
    res.status(error.statusCode || 404);
    throw error;
  }
});

module.exports = {
  registerUser,
  authUser,
  getProfile,
};
