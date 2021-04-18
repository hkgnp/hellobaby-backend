const express = require('express');
const { Order } = require('../models');
const router = express.Router();
const getOrderDataLayer = require('../dal/orders');

router.get('/', async (req, res) => {
  const allUsers = await getOrderDataLayer.getAllUsers();
  const allStatuses = await getOrderDataLayer.getAllStatuses();
  allStatuses.unshift([0, 'Select a Status']);
  const allOrders = await Order.collection().fetch({
    withRelated: ['status', 'user'],
  });

  res.render('orders/index', {
    orders: allOrders.toJSON(),
    statuses: allStatuses,
  });
});

router.get('/updatestatus/:order_id/:new_status', async (req, res) => {
  // Get order and status
  let order = await getOrderDataLayer.getOrderById(req.params.order_id);
  let newStatus = req.params.new_status;

  // Update order with new status
  order.set('status_id', newStatus);
  order.save();

  // Redirect and inform of successful update
  req.flash('success_messages', 'Status updated successfully');
  res.redirect('/orders');
});

module.exports = router;
