const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const CartServices = require('../services/cart_services');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', async (req, res) => {
  //1. Create line items = tell Stripe what customer is paying for
  let cartServices = new CartServices(req.session.user.id);
  const allCartItems = await cartServices.getAll();
  let lineItems = [];
  let meta = [];

  for (let cartItem of allCartItems) {
    const lineItem = {
      name: cartItem.related('products').get('title'),
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
    },
  };
  //3. Register payment
  let stripeSession = await stripe.checkout.sessions.create(payment);

  //4. Send payment session ID to HBS file and use JS to redirect
  res.render('cart/checkout', {
    sessionId: stripeSession.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

router.post(
  '/process_payment',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        sigHeader,
        endpointSecret
      );
    } catch (e) {
      res.send({
        error: e.message,
      });
      console.log(e.message);
    }
    if (event.type == 'checkout.session.completed') {
      console.log(event.data.object);
    }
    res.sendStatus(200);
  }
);

router.get('/error', async (req, res) => {
  // Insert rendering of error message if payment is unsuccessful
});

module.exports = router;
