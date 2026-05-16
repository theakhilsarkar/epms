const asyncHandler = require('../utils/asyncHandler');
const Branch = require('../models/Branch');

// @desc    Get all branches
// @route   GET /api/branches
// @access  Private
const getBranches = asyncHandler(async (req, res) => {
  const branches = await Branch.find({});
  res.status(200).json({
    status: 'success',
    count: branches.length,
    data: branches,
  });
});

// @desc    Create new branch
// @route   POST /api/branches
// @access  Private/Admin
const createBranch = asyncHandler(async (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    res.status(400);
    throw new Error('Please provide all required fields: name, location');
  }

  const branchExists = await Branch.findOne({ name });
  if (branchExists) {
    res.status(400);
    throw new Error('Branch with this name already exists');
  }

  const branch = await Branch.create({
    name,
    location,
  });

  res.status(201).json({
    status: 'success',
    data: branch,
  });
});

// @desc    Update branch
// @route   PUT /api/branches/:id
// @access  Private/Admin
const updateBranch = asyncHandler(async (req, res) => {
  let branch = await Branch.findById(req.params.id);

  if (!branch) {
    res.status(404);
    throw new Error('Branch not found');
  }

  branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: branch,
  });
});

// @desc    Delete branch
// @route   DELETE /api/branches/:id
// @access  Private/Admin
const deleteBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);

  if (!branch) {
    res.status(404);
    throw new Error('Branch not found');
  }

  await branch.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Branch deleted successfully',
    id: req.params.id,
  });
});

module.exports = {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
};
