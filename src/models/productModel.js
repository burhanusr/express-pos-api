const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        50,
        'A product name must have less or equal then 40 characters',
      ],
      minLength: [
        3,
        'A product name must have more or equal then 10 characters',
      ],
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
      min: 1000,
    },
    stock: Number,
    status: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      required: [true, 'A product must have an image'],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tag',
      },
    ],
  },
  {
    strictQuery: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
