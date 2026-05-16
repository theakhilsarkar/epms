const asyncHandler = require('../utils/asyncHandler');
const Report = require('../models/Report');

// @desc    Submit weekly report
// @route   POST /api/reports
// @access  Private
const submitReport = asyncHandler(async (req, res) => {
  const { week, data } = req.body;

  if (!week || !data) {
    res.status(400);
    throw new Error('Please provide week and data');
  }

  // Ensure one report per week per employee
  const existingReport = await Report.findOne({ userId: req.user._id, week });

  if (existingReport) {
    res.status(400);
    throw new Error(`You have already submitted a report for week ${week}`);
  }

  const report = await Report.create({
    userId: req.user._id,
    role: req.user.role,
    week,
    data,
  });

  res.status(201).json({
    status: 'success',
    data: report,
  });
});

// @desc    Get my reports
// @route   GET /api/reports/my-reports
// @access  Private
const getMyReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ userId: req.user._id }).sort({
    submittedAt: -1,
  });

  res.status(200).json({
    status: 'success',
    count: reports.length,
    data: reports,
  });
});

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private/Admin
const getAllReports = asyncHandler(async (req, res) => {
  // Populate the userId to return name and email of the submitter
  const reports = await Report.find({})
    .populate('userId', 'name email branchId')
    .sort({ submittedAt: -1 });

  res.status(200).json({
    status: 'success',
    count: reports.length,
    data: reports,
  });
});

module.exports = {
  submitReport,
  getMyReports,
  getAllReports,
};
