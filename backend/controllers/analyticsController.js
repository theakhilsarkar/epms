const asyncHandler = require('../utils/asyncHandler');
const analyticsService = require('../services/analyticsService');

const getLeaderboard = asyncHandler(async (req, res) => {
  const data = await analyticsService.getLeaderboard(req.query);
  res.status(200).json({ success: true, message: 'Leaderboard fetched', data });
});

const getGroupedPerformance = asyncHandler(async (req, res) => {
  const data = await analyticsService.getGroupedPerformance(req.query.by);
  res.status(200).json({ success: true, message: 'Grouped performance fetched', data });
});

const getTargetVsAchievement = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTargetVsAchievement(req.params.roleName);
  res.status(200).json({ success: true, message: 'Target vs Achievement fetched', data });
});

module.exports = {
  getLeaderboard,
  getGroupedPerformance,
  getTargetVsAchievement
};
