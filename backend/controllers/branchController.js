const asyncHandler = require('../utils/asyncHandler');
const branchService = require('../services/branchService');

const getBranches = asyncHandler(async (req, res) => {
  const data = await branchService.getBranches();
  res.status(200).json({
    success: true,
    message: 'Branches retrieved successfully',
    data,
  });
});

const createBranch = asyncHandler(async (req, res) => {
  try {
    const data = await branchService.createBranch(req.body);
    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data,
    });
  } catch (error) {
    res.status(error.statusCode || 400);
    throw error;
  }
});

const updateBranch = asyncHandler(async (req, res) => {
  try {
    const data = await branchService.updateBranch(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Branch updated successfully',
      data,
    });
  } catch (error) {
    res.status(error.statusCode || 404);
    throw error;
  }
});

const deleteBranch = asyncHandler(async (req, res) => {
  try {
    const data = await branchService.deleteBranch(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Branch deleted successfully',
      data,
    });
  } catch (error) {
    res.status(error.statusCode || 404);
    throw error;
  }
});

module.exports = {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
};
