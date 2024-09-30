const Tag = require('../models/tagModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllTags = catchAsync(async (req, res) => {
  const tags = await Tag.find();

  res.status(200).json({
    status: 'success',
    result: tags.length,
    data: tags,
  });
});

exports.getTag = catchAsync(async (req, res) => {
  const tag = await Tag.findById(req.params.id);

  if (!tag) {
    throw new AppError('There is no tag found with that ID!', 404);
  }

  res.status(200).json({
    status: 'success',
    data: tag,
  });
});

exports.createTag = catchAsync(async (req, res) => {
  const tag = await Tag.create(req.body);

  res.status(201).json({
    status: 'success',
    data: tag,
  });
});

exports.updateTag = catchAsync(async (req, res) => {
  const tag = await Tag.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!tag) {
    throw new AppError('There is no tag found with that ID!', 404);
  }

  res.status(200).json({
    status: 'success',
    data: tag,
  });
});

exports.deleteTag = catchAsync(async (req, res) => {
  const tag = await Tag.findByIdAndDelete(req.params.id);

  if (!tag) {
    throw new AppError('There is no tag found with that ID!', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
