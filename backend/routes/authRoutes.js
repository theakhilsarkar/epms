const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  registerUser,
  authUser,
  getProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  validateRequest,
  registerUser
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  validateRequest,
  authUser
);

router.get('/profile', protect, getProfile);

module.exports = router;
