const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} = require('../controllers/branchController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

// Mount routes
router
  .route('/')
  .get(protect, getBranches)
  .post(
    protect, 
    authorizeRoles('admin'),
    [
      body('name', 'Branch name is required').notEmpty(),
      body('location', 'Branch location is required').notEmpty(),
    ],
    validateRequest,
    createBranch
  );

router
  .route('/:id')
  .put(
    protect, 
    authorizeRoles('admin'),
    [
      body('name', 'Branch name must not be empty').optional().notEmpty(),
      body('location', 'Branch location must not be empty').optional().notEmpty(),
    ],
    validateRequest,
    updateBranch
  )
  .delete(protect, authorizeRoles('admin'), deleteBranch);

module.exports = router;
