const express = require('express');
const { Order } = require('../models');
const router = express.Router();
const getOrderDataLayer = require('../dal/orders');

router.get('/', async (req, res) => {
  const allUsers = await getOrderDataLayer.getAllUsers();
  const allStatuses = await getOrderDataLayer.getAllStatuses();

  const allOrders = await Order.collection().fetch({
    withRelated: ['status', 'user'],
  });

  res.render('orders/index', {
    orders: allOrders.toJSON(),
    statuses: allStatuses,
  });
});

module.exports = router;
