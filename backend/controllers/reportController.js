const asyncHandler = require('../utils/asyncHandler');
const reportService = require('../services/reportService');

const submitReport = asyncHandler(async (req, res) => {
  try {
    const data = await reportService.submitReport(req.user._id, req.user.role, req.body);
    res.status(201).json({ success: true, message: 'Report submitted successfully', data });
  } catch (error) {
    res.status(error.statusCode || 400);
    throw error;
  }
});

const getMyReports = asyncHandler(async (req, res) => {
  const data = await reportService.getMyReports(req.user._id);
  res.status(200).json({ success: true, message: 'Reports fetched', data });
});

const getAllReports = asyncHandler(async (req, res) => {
  const data = await reportService.getAllReports();
  res.status(200).json({ success: true, message: 'All reports fetched', data });
});

module.exports = {
  submitReport,
  getMyReports,
  getAllReports,
};
