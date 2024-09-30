const Invoice = require('../models/invoiceModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getInvoice = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const invoice = await Invoice.findOne({ order: orderId })
    .populate('order')
    .populate('user');

  if (!invoice) {
    return next(
      new AppError('Invoice is not found, please make an order first.', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: invoice,
  });
});
