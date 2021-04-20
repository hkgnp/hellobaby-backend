const express = require('express');
const router = express.Router();

const getOrderDataLayer = require('../../dal/orders');

router.get('/:user_id', async (req, res) => {
  const orders = await getOrderDataLayer.getOrderByUser(req.params.user_id);

  res.send({
    orders: [orders.toJSON()],
  });
});

module.exports = router;
