const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [5, 'Maximum product name length is 50 character'],
    required: [true, 'Name must be filled'],
  },
  price: {
    type: Number,
    required: [true, 'Price is cannot be empty'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity cannot be empty'],
    min: [1, 'Minimum quantity required is 1'],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
  },
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;
