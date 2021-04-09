const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('landing/welcome');
});

router.get('/about-us', (req, res) => {
  res.render('landing/about');
});

router.get('/contact-us', (req, res) => {
  res.render('landing/contact');
});

module.exports = router;
