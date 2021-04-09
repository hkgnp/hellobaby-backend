const express = require('express');
const router = express.Router();

const CartServices = require('../services/cart_services');

router.get('/', async (req, res) => {
  try {
    let cart = new CartServices(req.session.user.id);
    const allItems = await cart.getAll();

    res.render('cart/index', {
      allItems: allItems.toJSON(),
    });
  } catch (e) {
    req.flash('error_messages', 'You are not logged in');
    res.redirect('/users/login');
    console.log(e);
  }
});

router.get('/:product_id/add', async (req, res) => {
  try {
    let cart = new CartServices(req.session.user.id);
    cart.addToCart(req.params.product_id, 1);
    req.flash('success_messages', 'Successfully added to cart');
    res.redirect('/products');
  } catch (e) {
    req.flash('error_messages', 'You are not logged in');
    res.redirect('/users/login');
    console.log(e);
  }
});

router.get('/:product_id/remove', async (req, res) => {
  let cart = new CartServices(req.session.user.id);
  await cart.removeItem(req.params.product_id);
  req.flash('success_messages', 'Item successfully removed');
  res.redirect('/cart');
});

router.post('/:product_id/quantity/update', async (req, res) => {
  let cart = new CartServices(req.session.user.id);
  await cart.updateQuantity(req.params.product_id, req.body.quantity);
  req.flash('success_messages', 'Quantity has been updated');
  res.redirect('back');
});

module.exports = router;
