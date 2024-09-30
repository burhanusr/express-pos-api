const express = require('express');

const authMiddleware = require('./../middlewares/authMiddleware');
const deliveryController = require('./../controllers/deliveryController');

const router = express.Router();

router
  .route('/')
  .get(deliveryController.getAllDeliveries)
  .post(authMiddleware.protect, deliveryController.createDelivery);

router
  .route('/:id')
  .get(deliveryController.getDelivery)
  .patch(deliveryController.updateDelivery)
  .delete(deliveryController.deleteDelivery);

module.exports = router;
