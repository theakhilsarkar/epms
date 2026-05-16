const Branch = require('../models/Branch');

const getBranches = async () => {
  return await Branch.find({});
};

const createBranch = async (branchData) => {
  const { name, location } = branchData;

  const branchExists = await Branch.findOne({ name });
  if (branchExists) {
    const err = new Error('Branch with this name already exists');
    err.statusCode = 400;
    throw err;
  }

  return await Branch.create({ name, location });
};

const updateBranch = async (id, branchData) => {
  let branch = await Branch.findById(id);

  if (!branch) {
    const err = new Error('Branch not found');
    err.statusCode = 404;
    throw err;
  }

  return await Branch.findByIdAndUpdate(id, branchData, {
    new: true,
    runValidators: true,
  });
};

const deleteBranch = async (id) => {
  const branch = await Branch.findById(id);

  if (!branch) {
    const err = new Error('Branch not found');
    err.statusCode = 404;
    throw err;
  }

  await branch.deleteOne();
  return { id };
};

module.exports = {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
};
