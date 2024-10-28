const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your fullname'],
      maxLength: [255, 'Maximum length allowed is 255 character'],
    },
    village: {
      type: String,
      required: [true, 'Please provide a village'],
      maxLength: [255, 'Maximum length allowed is 255 character'],
    },
    district: {
      type: String,
      required: [true, 'Please provide a district'],
      maxLength: [255, 'Maximum length allowed is 255 character'],
    },
    regency: {
      type: String,
      required: [true, 'Please provide a regency'],
      maxLength: [255, 'Maximum length allowed is 255 character'],
    },
    province: {
      type: String,
      required: [true, 'Please provide a province'],
      maxLength: [255, 'Maximum length allowed is 255 character'],
    },
    detail: {
      type: String,
      required: [true, 'Address detail is required'],
      maxLength: [
        1000,
        'Maximum length allowed for address detail is 100 character',
      ],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const DeliveryAddress = mongoose.model('DeliveryAddress', deliverySchema);

module.exports = DeliveryAddress;
