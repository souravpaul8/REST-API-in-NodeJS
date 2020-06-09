/* eslint-disable no-console */
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res) => {
  Order.find()
    .select('product _id quantity')
    .populate('product', 'name')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => ({
          product: doc.product,
          quantity: doc.quantity,
          // eslint-disable-next-line no-underscore-dangle
          _id: doc._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${doc.id}`,
          },
        })),
      };
      // eslint-disable-next-line no-console
      console.log(response);
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_new_order = (req, res) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(500).json({
        message: 'Order was created',
        createdOrder: {
          product: result.product,
          quantity: result.quantity,
          // eslint-disable-next-line no-underscore-dangle
          _id: result._id,
        },
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${result.id}`,
        },
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_get_single = (req, res) => {
  Order.findById(req.params.orderId)
    .exec()
  // eslint-disable-next-line consistent-return
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        });
      }
      res.status(200).json({
        order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/',
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.order_delete = (req, res) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders/',
          body: {
            productId: 'ID',
            quantity: 'Number',
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
