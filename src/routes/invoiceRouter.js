const express = require('express');

const invoiceController = require('./../controllers/invoiceController');
const authMiddleware = require('./../middlewares/authMiddleware');

const router = express.Router();

router
  .route('/:orderId')
  .get(authMiddleware.protect, invoiceController.getInvoice);

module.exports = router;
