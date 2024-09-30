const fs = require('fs');

const Product = require('./../models/productModel');
const Category = require('./../models/categoryModel');
const Tag = require('./../models/tagModel');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

const removeProductImage = (image) => {
  const imagePath = `${__dirname}/../../public/images/products/${image}`;
  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
};

exports.getAllProducts = catchAsync(async (req, res) => {
  if (req.query.category) {
    req.query.category = await Category.findOne(
      { name: { $regex: req.query.category, $options: 'i' } },
      { _id: 1 }
    );
  }

  if (req.query.tags) {
    const tags = req.query.tags.split(' ');

    const tagsRegex = tags.map((tag) => ({
      name: { $regex: tag, $options: 'i' },
    }));

    const tagsQuery = await Tag.find({ $or: tagsRegex }, { _id: 1 });
    req.query.tags = { in: tagsQuery };
  }

  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .selectFields()
    .paginate();

  const products = await features.query;

  res.status(200).json({
    status: 'success',
    result: products.length,
    data: products,
  });
});

exports.getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category')
    .populate('tags');

  if (!product) {
    throw new AppError('There is no product found with that ID!', 404);
  }

  res.status(200).json({
    status: 'success',
    data: product,
  });
});

exports.createProduct = catchAsync(async (req, res) => {
  const payload = Object.assign({}, req.body);

  if (req.file) payload.image = req.file.filename;

  if (payload.category) {
    const category = await Category.findOne({
      name: { $regex: payload.category, $options: 'i' },
    });

    if (category) {
      payload.category = category._id;
    } else {
      delete payload.category;
    }
  }

  if (payload.tags) {
    const tagsRegex = payload.tags.map((tag) => ({
      name: { $regex: tag, $options: 'i' },
    }));

    const tags = await Tag.find({ $or: tagsRegex });

    if (tags.length > 0) {
      payload.tags = tags.map((tag) => tag._id);
    } else {
      delete payload.tags;
    }
  }

  const product = await Product.create(payload);

  res.status(201).json({
    status: 'success',
    data: product,
  });
});

exports.updateProduct = catchAsync(async (req, res) => {
  // get request body
  const payload = Object.assign({}, req.body);

  if (req.file) payload.image = req.file.filename;

  if (payload.category) {
    const category = await Category.findOne({
      name: { $regex: payload.category, $options: 'i' },
    });

    if (category) {
      payload.category = category._id;
    } else {
      delete payload.category;
    }
  }

  if (payload.tags) {
    const tagsRegex = payload.tags.map((tag) => ({
      name: { $regex: tag, $options: 'i' },
    }));

    const tags = await Tag.find({ $or: tagsRegex });

    if (tags.length > 0) {
      payload.tags = tags.map((tag) => tag._id);
    } else {
      delete payload.tags;
    }
  }

  // get old product data before get updated
  const oldProduct = await Product.findById(req.params.id);

  // throw an error if there is no product match with id
  if (!oldProduct) {
    throw new AppError('There is no product found with that ID!', 404);
  }

  // update product
  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  // remove old product image in public if it existed
  if (req.file) removeProductImage(oldProduct.image);

  res.status(200).json({
    status: 'success',
    data: product,
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new AppError('There is no product found with that ID!', 404);
  }

  removeProductImage(product.image);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
