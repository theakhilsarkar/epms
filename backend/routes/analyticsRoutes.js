const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getGroupedPerformance,
  getTargetVsAchievement,
} = require('../controllers/analyticsController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect, authorizeRoles('admin'));

router.get('/leaderboard', getLeaderboard);
router.get('/grouped', getGroupedPerformance);
router.get('/targets/:roleName', getTargetVsAchievement);

module.exports = router;
