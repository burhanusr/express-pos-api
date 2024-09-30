const mongoose = require('mongoose');

// Cart Item Schema
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Item must have quantity'],
      min: [1, 'Item quantity minimum is 1'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// Cart Schema
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// Calculate total price method
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
