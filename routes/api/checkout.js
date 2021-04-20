const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const CartServices = require('../../services/cart_services');
const OrderServices = require('../../services/order_services');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/:user_id', async (req, res) => {
  //1. Create line items = tell Stripe what customer is paying for
  let cartServices = new CartServices(req.params.user_id);
  const allCartItems = await cartServices.getAll();
  let lineItems = [];
  let meta = [];

  for (let cartItem of allCartItems) {
    const lineItem = {
      name: cartItem.related('products').get('name'),
      amount: cartItem.related('products').get('cost'),
      quantity: cartItem.get('quantity'),
      currency: 'SGD',
    };
    // Check if the related product has an image
    if (cartItem.related('products').get('image_url')) {
      lineItem.images = [cartItem.related('product').get('image_url')];
    }
    lineItems.push(lineItem);
    // Keep track of each product's quantity purchase
    meta.push({
      product_id: cartItem.get('product_id'),
      quantity: cartItem.get('quantity'),
    });
  }

  //2. Use Stripe to create payment
  let metaData = JSON.stringify(meta);
  const payment = {
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url:
      process.env.STRIPE_SUCCESS_URL + '?sessionId = {CHECKOUT_SESSION_ID}',
    cancel_url: process.env.STRIPE_ERROR_URL,
    metadata: {
      orders: metaData,
      user_id: req.params.user_id,
    },
  };
  //3. Register payment
  let stripeSession = await stripe.checkout.sessions.create(payment);

  // 3a. Create order when stripe session is created.
  const { id, metadata } = stripeSession;
  const orderId = id;
  const userId = metadata.user_id;
  const statusId = 6;

  // Maybe implemented at a later date.
  const orders = metadata.orders;
  console.log(orders);

  let order = await new OrderServices(userId);
  order.addOrder(orderId, userId, statusId);

  res.send({
    sessionId: stripeSession.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// Route to clear cart
router.get('/success/:user_id', async (req, res) => {
  // Remove items after successful checkout
  let cart = await new CartServices(req.params.user_id);
  const allItems = await cart.getAll();
  await Promise.all(allItems.map((item) => item.destroy()));

  // Send success message
  res.send({
    message: 'Thank you for your purchase',
  });
});

module.exports = router;
