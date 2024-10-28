const Product = require('../models/productModel');
const Cart = require('./../models/cartModel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.addCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId, { _id: 1, price: 1 });

  if (!product) {
    return next(new AppError('Product not found!', 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // looking for index of existing product in cart
  const existingItemIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );

  if (existingItemIndex !== -1) {
    // if product already in cart, update its quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // if not, add as new item
    cart.items.push({
      product: product._id,
      quantity: quantity,
      price: product.price,
    });
  }

  const updatedCart = await cart.save();

  res.status(201).json({
    status: 'success',
    data: updatedCart,
  });
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId, { _id: 1, price: 1 });

  if (!product) {
    return next(new AppError('Product not found!', 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // looking for index of existing product in cart
  const existingItemIndex = cart.items.findIndex((item) =>
    item.product.equals(productId)
  );

  if (existingItemIndex !== -1) {
    // if product already in cart, update its quantity
    cart.items[existingItemIndex].quantity -= quantity;

    // if product have zero qty then delete it from cart
    if (cart.items[existingItemIndex].quantity === 0) {
      cart.items.splice(existingItemIndex, 1);
    }
  }

  // if (cart.items.length === 0) {
  //   await Cart.findOneAndDelete({ user: req.user._id });

  //   res.status(204).json({
  //     status: 'success',
  //     data: null,
  //   });
  // }
  const updatedCart = await cart.save();

  res.status(201).json({
    status: 'success',
    data: updatedCart,
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  // Populate cart items with product details, including the latest price
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product'
  );

  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});
