const asyncHandler = require('../utils/asyncHandler');
const RoleConfig = require('../models/RoleConfig');

// @desc    Get role config by role name
// @route   GET /api/role-configs/:roleName
// @access  Private
const getRoleConfig = asyncHandler(async (req, res) => {
  const { roleName } = req.params;
  const config = await RoleConfig.findOne({ roleName });

  if (!config) {
    res.status(404);
    throw new Error(`Configuration for role '${roleName}' not found`);
  }

  res.status(200).json({
    status: 'success',
    data: config,
  });
});

// @desc    Get all role configs
// @route   GET /api/role-configs
// @access  Private/Admin
const getAllRoleConfigs = asyncHandler(async (req, res) => {
  const configs = await RoleConfig.find({});
  res.status(200).json({
    status: 'success',
    count: configs.length,
    data: configs,
  });
});

// @desc    Create role config
// @route   POST /api/role-configs
// @access  Private/Admin
const createRoleConfig = asyncHandler(async (req, res) => {
  const { roleName, fields } = req.body;

  if (!roleName || !fields || !Array.isArray(fields)) {
    res.status(400);
    throw new Error('Please provide roleName and a fields array');
  }

  const existingConfig = await RoleConfig.findOne({ roleName });
  if (existingConfig) {
    res.status(400);
    throw new Error(`Configuration for role '${roleName}' already exists`);
  }

  const config = await RoleConfig.create({
    roleName,
    fields,
  });

  res.status(201).json({
    status: 'success',
    data: config,
  });
});

// @desc    Update role config
// @route   PUT /api/role-configs/:roleName
// @access  Private/Admin
const updateRoleConfig = asyncHandler(async (req, res) => {
  const { roleName } = req.params;

  let config = await RoleConfig.findOne({ roleName });

  if (!config) {
    res.status(404);
    throw new Error(`Configuration for role '${roleName}' not found`);
  }

  config = await RoleConfig.findOneAndUpdate({ roleName }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: config,
  });
});

// @desc    Delete role config
// @route   DELETE /api/role-configs/:roleName
// @access  Private/Admin
const deleteRoleConfig = asyncHandler(async (req, res) => {
  const { roleName } = req.params;
  const config = await RoleConfig.findOne({ roleName });

  if (!config) {
    res.status(404);
    throw new Error(`Configuration for role '${roleName}' not found`);
  }

  await config.deleteOne();

  res.status(200).json({
    status: 'success',
    message: `Configuration for role '${roleName}' deleted successfully`,
  });
});

module.exports = {
  getRoleConfig,
  getAllRoleConfigs,
  createRoleConfig,
  updateRoleConfig,
  deleteRoleConfig,
};
