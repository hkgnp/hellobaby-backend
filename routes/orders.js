const express = require('express');
const { Order, OrderItem } = require('../models');
const router = express.Router();
const getOrderDataLayer = require('../dal/orders');

const { checkIfLoggedIn } = require('../middleware');

router.get('/', checkIfLoggedIn, async (req, res) => {
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

router.get('/remove/:order_id', async (req, res) => {
  const order = await getOrderDataLayer.getOrderById(req.params.order_id);

  await order.destroy();

  req.flash('success_messages', 'Order has been removed successfully');
  res.redirect('/orders');
});

router.get('/orderitems/:order_id', async (req, res) => {
  const allOrderItems = await OrderItem.collection()
    .where({
      order_id: req.params.order_id,
    })
    .fetch({
      withRelated: ['products', 'users', 'orders'],
    });

  const orderItems = allOrderItems.toJSON();

  res.render('orders/orderitems', {
    orderItems: orderItems,
    orderId: orderItems[0].orders.order_id,
  });

  router.get('/orderitems/remove/:item_id', async (req, res) => {
    const order = await getOrderDataLayer.getOrderItemById(req.params.item_id);

    await order.destroy();

    req.flash(
      'success_messages',
      'Item has been removed from order successfully'
    );
    res.redirect('back');
  });
});

module.exports = router;
