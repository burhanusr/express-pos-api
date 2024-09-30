const express = require('express');

const authMiddleware = require('./../middlewares/authMiddleware');
const productMiddleware = require('./../middlewares/productMiddleware');
const productController = require('./../controllers/productController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authMiddleware.protect,
    productMiddleware.uploadProductImage,
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productMiddleware.uploadProductImage, productController.updateProduct)
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.deleteProduct
  );

module.exports = router;
