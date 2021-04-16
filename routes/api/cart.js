const express = require('express');
const router = express.Router();

const CartServices = require('../../services/cart_services');

router.get('/:user_id', async (req, res) => {
  let cart = await new CartServices(req.params.user_id);
  const allItems = await cart.getAll();

  res.send({
    allItems: allItems.toJSON(),
  });
});

router.get('/add/:user_id/:product_id', async (req, res) => {
  let cart = await new CartServices(req.params.user_id);
  cart.addToCart(req.params.product_id, 1);

  res.send({
    message: 'Item added to cart successfully',
  });
});

router.post('/update/:user_id/:product_id', async (req, res) => {
  let cart = await new CartServices(req.params.user_id);
  console.log(req.body.quantity);
  console.log(cart);
  console.log(req.params.user_id);
  console.log(req.params.product_id);
  let msg = await cart.updateQuantity(req.params.product_id, req.body.quantity);
  console.log(msg);
  res.send({
    message: 'Quantity has been updated',
  });
});

module.exports = router;
