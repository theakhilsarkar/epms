// @desc    Check server health
// @route   GET /api/health
// @access  Public
const checkHealth = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running smoothly',
  });
};

module.exports = {
  checkHealth,
};
