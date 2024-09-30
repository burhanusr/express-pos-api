const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    sub_total: {
      type: Number,
      required: [true, 'Sub total cannot be empty'],
    },
    delivery_fee: {
      type: Number,
      required: [true, 'Delivery fee cannot be empty'],
    },
    delivery_address: {
      provinsi: { type: String, required: [true, 'Province required'] },
      kabupaten: { type: String, required: [true, 'Regency required'] },
      kecamatan: { type: String, required: [true, 'District required'] },
      kelurahan: { type: String, required: [true, 'Urban village required'] },
      detail: { type: String },
    },
    total: {
      type: Number,
      required: [true, 'total harus diisi'],
    },
    payment_status: {
      type: String,
      enum: ['waiting_payment', 'paid'],
      default: 'waiting_payment',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
