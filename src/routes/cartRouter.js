const express = require('express');

const cartController = require('./../controllers/cartController');
const authMiddleware = require('./../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.route('/').get(cartController.getCart).post(cartController.addCart);

module.exports = router;
