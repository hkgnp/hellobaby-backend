const express = require('express');
const router = express.Router();

const CartServices = require('../../services/cart_services');

router.get('/', async (req, res) => {
  let cart = await new CartServices(req.session.user.id);
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

module.exports = router;
