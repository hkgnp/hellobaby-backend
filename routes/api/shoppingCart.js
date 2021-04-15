const express = require('express');
const router = express.Router();

const CartServices = require('.../services/cart_services');

router.get('/', async (req, res) => {
  let cart = await new CartServices(req.session.user.id);
  const allItems = await cart.getAll();

  res.send({
    allItems: allItems.toJSON(),
  });
});
