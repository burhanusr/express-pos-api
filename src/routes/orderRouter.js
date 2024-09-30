const express = require('express');

const orderController = require('./../controllers/orderController');
const authMiddleware = require('./../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(orderController.getOrder)
  .post(orderController.createOrder);

module.exports = router;
