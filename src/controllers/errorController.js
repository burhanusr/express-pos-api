const fs = require('fs');
const mongoose = require('mongoose');

const AppError = require('./../utils/appError');

/**
 * Error handler for handling error from database.
 */

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue).join('');
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Error handler for handling error from Json Web Token.
 */

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired!. Please log in again', 401);
};

/**
 * Mark error to be operational error.
 */

const markAsOperationalErrors = (err) => {
  // handle CastError (e.g., invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    err = handleCastErrorDB(err);
  }

  // handle ValidationError
  if (err instanceof mongoose.Error.ValidationError) {
    err = handleValidationErrorDB(err);
  }

  // check for MongoDB duplicate key error (code 11000)
  if (err.code === 11000) err = handleDuplicateFieldsDB(err);

  // handle JWT error
  if (err.name === 'JsonWebTokenError') err = handleJWTError();
  if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();

  return err;
};

/**
 * Send error response based on node environment.
 */

const sendErrorDev = (err, res) => {
  // send all error information
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // operational Error, trusted error: send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // programming Error or other unknown error: don't leak error details
    console.error('ERROR: ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // remove image from public if error occurred before actualy saved data to database
  if (req.file) fs.unlinkSync(req.file.path);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    err = markAsOperationalErrors(err);

    sendErrorProd(err, res);
  }
};
