/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable eol-last */
const express = require('express');
const OrdersController = require('../controllers/orders');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.orders_new_order);

router.get('/:orderId', checkAuth, OrdersController.orders_get_single);

router.delete('/:orderId', checkAuth, OrdersController.order_delete);

module.exports = router;