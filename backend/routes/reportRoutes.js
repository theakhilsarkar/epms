const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  submitReport,
  getMyReports,
  getAllReports,
} = require('../controllers/reportController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { checkReportSubmissionTime } = require('../middleware/timeValidationMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

router.route('/my-reports').get(protect, getMyReports);

router
  .route('/')
  .post(
    protect, 
    checkReportSubmissionTime,
    [
      body('week', 'Week is required and must be a string').isString().notEmpty(),
      body('data', 'Data must be an object').isObject()
    ],
    validateRequest,
    submitReport
  )
  .get(protect, authorizeRoles('admin'), getAllReports);

module.exports = router;
