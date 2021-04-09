const express = require('express');
const router = express.Router();

const getProductDataLayer = require('../../dal/products.js');
const { createProductForm } = require('../../forms/index.js');
const { Product } = require('../../models');

router.get('/', async (req, res) => {
  const allProducts = await getProductDataLayer.getAllProducts();
  res.send(allProducts);
});

router.post('/', async (req, res) => {
  // Option 1: This assumes that the form already has all the required fields
  //   let newProduct = new Product(req.body.data);
  //   newProduct.save();

  //Option 2: Use Caolan forms' validation
  const allCategories = await getProductDataLayer.getAllCategories();
  const allTags = await getProductDataLayer.getAllTags();

  const productForm = createProductForm(allCategories, allTags);

  productForm.handle(req, {
    success: async (form) => {
      let { tags, ...productData } = form.data;
      const product = new Product(productData);
      await product.save();

      if (tags) {
        await product.tags().attach(tags.split(','));
      }
      res.send(product);
    },
    error: (form) => {
      let errors = {};
      for (let key in form.fields) {
        if (form.fields[key].error) {
          errors[key] = form.fields[key].error;
        }
      }
      res.send(JSON.stringify(errors));
    },
  });
});

module.exports = router;
