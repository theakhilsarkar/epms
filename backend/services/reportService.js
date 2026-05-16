const Report = require('../models/Report');

const submitReport = async (userId, role, reportData) => {
  const { week, data } = reportData;

  const existingReport = await Report.findOne({ userId, week });
  if (existingReport) {
    const err = new Error(`You have already submitted a report for week ${week}`);
    err.statusCode = 400;
    throw err;
  }

  return await Report.create({
    userId,
    role,
    week,
    data,
  });
};

const getMyReports = async (userId) => {
  return await Report.find({ userId }).sort({ submittedAt: -1 });
};

const getAllReports = async () => {
  return await Report.find({})
    .populate('userId', 'name email branchId')
    .sort({ submittedAt: -1 });
};

module.exports = {
  submitReport,
  getMyReports,
  getAllReports,
};
