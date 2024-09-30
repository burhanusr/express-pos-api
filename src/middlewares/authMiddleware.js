const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('../models/userModel');

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  // getting token
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  // check if token exists
  if (!token) {
    return next(new AppError('You are not logged in!', 401));
  }

  // verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // check if user still exists
  const loggedUser = await User.findById(decoded.id);
  if (!loggedUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // check if user changed password after the token was issued
  if (loggedUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // grant access to protected route
  req.user = loggedUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
