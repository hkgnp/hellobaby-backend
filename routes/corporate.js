const express = require('express');
const router = express.Router();

router.get('/founders', (req, res) => {
  res.send('About the Founders');
});

router.get('/funding', (req, res) => {
  res.send('Funding Details');
});

module.exports = router;
