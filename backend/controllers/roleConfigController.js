const asyncHandler = require('../utils/asyncHandler');
const roleConfigService = require('../services/roleConfigService');

const getRoleConfig = asyncHandler(async (req, res) => {
  try {
    const data = await roleConfigService.getRoleConfig(req.params.roleName);
    res.status(200).json({ success: true, message: 'Role config fetched', data });
  } catch (error) {
    res.status(error.statusCode || 404);
    throw error;
  }
});

const getAllRoleConfigs = asyncHandler(async (req, res) => {
  const data = await roleConfigService.getAllRoleConfigs();
  res.status(200).json({ success: true, message: 'Role configs fetched', data });
});

const createRoleConfig = asyncHandler(async (req, res) => {
  try {
    const data = await roleConfigService.createRoleConfig(req.body);
    res.status(201).json({ success: true, message: 'Role config created', data });
  } catch (error) {
    res.status(error.statusCode || 400);
    throw error;
  }
});

const updateRoleConfig = asyncHandler(async (req, res) => {
  try {
    const data = await roleConfigService.updateRoleConfig(req.params.roleName, req.body);
    res.status(200).json({ success: true, message: 'Role config updated', data });
  } catch (error) {
    res.status(error.statusCode || 404);
    throw error;
  }
});

const deleteRoleConfig = asyncHandler(async (req, res) => {
  try {
    const data = await roleConfigService.deleteRoleConfig(req.params.roleName);
    res.status(200).json({ success: true, message: 'Role config deleted', data });
  } catch (error) {
    res.status(error.statusCode || 404);
    throw error;
  }
});

module.exports = {
  getRoleConfig,
  getAllRoleConfigs,
  createRoleConfig,
  updateRoleConfig,
  deleteRoleConfig,
};
