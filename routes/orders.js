const express = require('express');
const { Order } = require('../models');
const router = express.Router();
const getOrderDataLayer = require('../dal/orders');

router.get('/', async (req, res) => {
  //   const allUsers = await getOrderDataLayer.getAllUsers();
  const allStatuses = await getOrderDataLayer.getAllStatuses();

  const allOrders = await Order.fetchAll({
    withRelated: ['status'],
  });

  res.render('orders/index', {
    orders: allOrders.toJSON(),
  });
});

module.exports = router;
