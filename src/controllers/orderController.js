const DeliveryAddress = require('../models/deliveryModel');
const OrderItem = require('../models/orderItemModel');
const Order = require('../models/orderModel');
const Cart = require('./../models/cartModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { delivery_fee, delivery_address } = req.body;

  const items = await Cart.find({ user: req.user._id }).populate(
    'items.product'
  );

  if (!items) {
    return next(new AppError('Your cart is empty', 400));
  }

  const address = await DeliveryAddress.findById(delivery_address);

  let order = new Order({
    delivery_fee: delivery_fee,
    delivery_address: {
      provinsi: address.provinsi,
      kabupaten: address.kabupaten,
      kecamatan: address.kecamatan,
      kelurahan: address.kelurahan,
      detail: address.detail,
    },
    user: req.user._id,
  });

  let orderItems = await OrderItem.insertMany(
    items.map((item) => ({
      ...items,
      name: item.product.name,
      quantity: parseInt(item.quantity),
      price: parseInt(item.product.price),
      order: order._id,
      product: item.product._id,
    }))
  );

  orderItems.forEach((item) => order.order_items.push(item));
  order.save();

  await Cart.deleteMany({ user: req.user._id });

  res.status(201).json({
    status: 'success',
    data: order,
  });
});

exports.getOrder = catchAsync(async (req, res) => {
  const order = await Order.find({ user: req.user._id });

  res.status(200).json({
    status: 'success',
    data: order,
  });
});
