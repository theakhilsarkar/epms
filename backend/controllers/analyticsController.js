const asyncHandler = require('../utils/asyncHandler');
const Report = require('../models/Report');
const RoleConfig = require('../models/RoleConfig');
const User = require('../models/User');
const Branch = require('../models/Branch');

// Helper function to aggregate report data dynamically
const aggregateReports = (reports) => {
  const aggregated = {};
  reports.forEach(report => {
    Object.keys(report.data).forEach(key => {
      aggregated[key] = (aggregated[key] || 0) + Number(report.data[key] || 0);
    });
  });
  return aggregated;
};

// @desc    Get leaderboard (Rank employees by score)
// @route   GET /api/analytics/leaderboard
// @access  Private/Admin
const getLeaderboard = asyncHandler(async (req, res) => {
  const { timeframe, week, month } = req.query; 

  // Build query based on filters
  let query = {};
  if (week) {
    query.week = week; // e.g., '2026-W20'
  } else if (month) {
    // Regex to match the month part of the ISO week, or if month is passed differently
    // For simplicity, assuming if 'month' is passed, we fetch reports where week starts with that month (rough approximation)
    // In a real app, week strings or date ranges would be used.
  }

  const reports = await Report.find(query).populate('userId', 'name role branchId');
  const roleConfigs = await RoleConfig.find({});
  
  const userStats = {};

  reports.forEach(report => {
    if (!report.userId) return; // Skip if user was deleted
    const userId = report.userId._id.toString();
    
    if (!userStats[userId]) {
      userStats[userId] = {
        user: report.userId,
        reportCount: 0,
        data: {},
      };
    }
    
    userStats[userId].reportCount += 1;
    
    Object.keys(report.data).forEach(key => {
      userStats[userId].data[key] = (userStats[userId].data[key] || 0) + Number(report.data[key] || 0);
    });
  });

  const leaderboard = [];

  Object.values(userStats).forEach(stat => {
    const roleConfig = roleConfigs.find(c => c.roleName === stat.user.role);
    let score = 0;
    
    if (roleConfig && roleConfig.fields) {
      let totalPercentage = 0;
      let metricsWithTargets = 0;
      
      roleConfig.fields.forEach(field => {
        const keyExact = field.label;
        const keySlug = field.label.toLowerCase().replace(/ /g, '_');
        
        const achievement = stat.data[keyExact] || stat.data[keySlug] || 0;
        const weeklyTarget = Number(field.target);
        
        // Handle missing target cases
        if (weeklyTarget && weeklyTarget > 0) {
          metricsWithTargets++;
          const totalTarget = weeklyTarget * stat.reportCount;
          totalPercentage += (achievement / totalTarget) * 100;
        }
      });
      
      if (metricsWithTargets > 0) {
        score = totalPercentage / metricsWithTargets;
      }
    }
    
    leaderboard.push({
      userId: stat.user._id,
      name: stat.user.name,
      role: stat.user.role,
      branchId: stat.user.branchId,
      score: Math.round(score * 100) / 100, // Round to 2 decimals
      achievements: stat.data,
      reportCount: stat.reportCount
    });
  });

  // Sort descending by score
  leaderboard.sort((a, b) => b.score - a.score);

  res.status(200).json({
    status: 'success',
    count: leaderboard.length,
    data: leaderboard,
  });
});

// @desc    Get overall performance grouped by role or branch
// @route   GET /api/analytics/grouped
// @access  Private/Admin
const getGroupedPerformance = asyncHandler(async (req, res) => {
  const { by } = req.query; // 'role' or 'branch'
  
  const reports = await Report.find({}).populate('userId', 'role branchId');
  
  const grouped = {};
  
  reports.forEach(report => {
    if (!report.userId) return;
    
    const groupKey = by === 'branch' ? report.userId.branchId : report.userId.role;
    const key = groupKey || 'Unknown';
    
    if (!grouped[key]) {
      grouped[key] = {
        name: key,
        reportCount: 0,
        data: {}
      };
    }
    
    grouped[key].reportCount += 1;
    
    Object.keys(report.data).forEach(dataKey => {
      grouped[key].data[dataKey] = (grouped[key].data[dataKey] || 0) + Number(report.data[dataKey] || 0);
    });
  });
  
  res.status(200).json({
    status: 'success',
    data: Object.values(grouped)
  });
});

// @desc    Get target vs achievement for a role
// @route   GET /api/analytics/targets/:roleName
// @access  Private/Admin
const getTargetVsAchievement = asyncHandler(async (req, res) => {
  const { roleName } = req.params;
  
  const roleConfig = await RoleConfig.findOne({ roleName });
  if (!roleConfig) {
    res.status(404);
    throw new Error('Role configuration not found');
  }
  
  const reports = await Report.find({ role: roleName });
  const aggregatedData = aggregateReports(reports);
  const totalReports = reports.length;
  
  const comparison = roleConfig.fields.map(field => {
    const keyExact = field.label;
    const keySlug = field.label.toLowerCase().replace(/ /g, '_');
    
    const achievement = aggregatedData[keyExact] || aggregatedData[keySlug] || 0;
    const totalTarget = (Number(field.target) || 0) * totalReports;
    
    return {
      metric: field.label,
      target: totalTarget,
      achievement: achievement,
      percentage: totalTarget > 0 ? Math.round((achievement / totalTarget) * 100) : null
    };
  });
  
  res.status(200).json({
    status: 'success',
    role: roleName,
    reportCount: totalReports,
    data: comparison
  });
});

module.exports = {
  getLeaderboard,
  getGroupedPerformance,
  getTargetVsAchievement
};
