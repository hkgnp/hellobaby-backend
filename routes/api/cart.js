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
  let msg = await cart.updateQuantity(req.params.product_id, req.body.quantity);
  res.send({
    message: 'Quantity has been updated',
  });
});

router.get('/remove/:user_id/:product_id', async (req, res) => {
  let cart = await new CartServices(req.params.user.id);
  await cart.removeItem(req.params.product_id);
  res.send({
    message: 'Item has been removed from the cart',
  });
});

module.exports = router;
