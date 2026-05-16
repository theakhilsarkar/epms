const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getRoleConfig,
  getAllRoleConfigs,
  createRoleConfig,
  updateRoleConfig,
  deleteRoleConfig,
} = require('../controllers/roleConfigController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

router
  .route('/')
  .get(protect, authorizeRoles('admin'), getAllRoleConfigs)
  .post(
    protect, 
    authorizeRoles('admin'),
    [
      body('roleName', 'Role name is required').notEmpty(),
      body('fields', 'Fields must be an array').isArray(),
      body('fields.*.label', 'Field label is required').notEmpty(),
      body('fields.*.type', 'Field type is required').notEmpty()
    ],
    validateRequest,
    createRoleConfig
  );

router
  .route('/:roleName')
  .get(protect, getRoleConfig)
  .put(
    protect, 
    authorizeRoles('admin'),
    [
      body('fields', 'Fields must be an array').optional().isArray(),
      body('fields.*.label', 'Field label is required').optional().notEmpty(),
      body('fields.*.type', 'Field type is required').optional().notEmpty()
    ],
    validateRequest,
    updateRoleConfig
  )
  .delete(protect, authorizeRoles('admin'), deleteRoleConfig);

module.exports = router;
