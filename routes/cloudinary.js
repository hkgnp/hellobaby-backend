const express = require('express');
const router = express.Router();

// import cloudinary
const cloudinary = require('cloudinary');

router.get('/sign', async (req, res) => {
  // retrieve params to send to cloudinary
  const params_to_sign = JSON.parse(req.query.params_to_sign);
  // retrieve api secret from config vars
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  // get csrf token
  const signature = cloudinary.utils.api_sign_request(
    params_to_sign,
    apiSecret
  );

  res.send(signature);
});

module.exports = router;
