const RoleConfig = require('../models/RoleConfig');

const getRoleConfig = async (roleName) => {
  const config = await RoleConfig.findOne({ roleName });
  if (!config) {
    const err = new Error(`Configuration for role '${roleName}' not found`);
    err.statusCode = 404;
    throw err;
  }
  return config;
};

const getAllRoleConfigs = async () => {
  return await RoleConfig.find({});
};

const createRoleConfig = async (configData) => {
  const { roleName, fields } = configData;

  const existingConfig = await RoleConfig.findOne({ roleName });
  if (existingConfig) {
    const err = new Error(`Configuration for role '${roleName}' already exists`);
    err.statusCode = 400;
    throw err;
  }

  return await RoleConfig.create({ roleName, fields });
};

const updateRoleConfig = async (roleName, configData) => {
  let config = await RoleConfig.findOne({ roleName });

  if (!config) {
    const err = new Error(`Configuration for role '${roleName}' not found`);
    err.statusCode = 404;
    throw err;
  }

  return await RoleConfig.findOneAndUpdate({ roleName }, configData, {
    new: true,
    runValidators: true,
  });
};

const deleteRoleConfig = async (roleName) => {
  const config = await RoleConfig.findOne({ roleName });

  if (!config) {
    const err = new Error(`Configuration for role '${roleName}' not found`);
    err.statusCode = 404;
    throw err;
  }

  await config.deleteOne();
  return { roleName };
};

module.exports = {
  getRoleConfig,
  getAllRoleConfigs,
  createRoleConfig,
  updateRoleConfig,
  deleteRoleConfig,
};
