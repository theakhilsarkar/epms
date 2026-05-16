const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = async (userData) => {
  const { name, email, password, role, branchId } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    const err = new Error('User already exists');
    err.statusCode = 400;
    throw err;
  }

  const isAdmin = role === 'admin';

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'counselor',
    branchId,
    isAdmin,
  });

  if (!user) {
    const err = new Error('Invalid user data');
    err.statusCode = 400;
    throw err;
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    branchId: user.branchId,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  };
};

const authUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      branchId: user.branchId,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    };
  } else {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    branchId: user.branchId,
    isAdmin: user.isAdmin,
  };
};

module.exports = {
  registerUser,
  authUser,
  getProfile,
};
