const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getCurrentUser = catchAsync(async (req, res) => {
  let user = await User.findById(req.user._id, { name: 1, email: 1, _id: 0 });

  if (!user) {
    throw new AppError('No User found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});
