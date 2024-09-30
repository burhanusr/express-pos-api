const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const productRouter = require('./routes/productRouter');
const categoryRouter = require('./routes/categoryRouter');
const tagRouter = require('./routes/tagRouter');
const userRouter = require('./routes/userRouter');
const deliveryRouter = require('./routes/deliveryRouter');
const cartRouter = require('./routes/cartRouter');
const orderRouter = require('./routes/orderRouter');
const invoiceRouter = require('./routes/invoiceRouter');

const app = express();

// middleware
if (process.env.NODE_ENV === 'development') app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route middleware
app.use('/api/v1/products', productRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/tags', tagRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/delivery', deliveryRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/invoice', invoiceRouter);

// catch 404 and forward to error handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handler
app.use(globalErrorHandler);

module.exports = app;
