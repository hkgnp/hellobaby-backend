const express = require('express');
const router = express.Router();

// import the Product, Category and Tag model
const { Product, Category, Tag } = require('../models');

// import the forms
const {
  createProductForm,
  createProductSearchForm,
  bootstrapField,
  addCategoryAddTags,
} = require('../forms');

// import middleware protection
const { checkIfLoggedIn } = require('../middleware');

// import dal
const getProductDataLayer = require('../dal/products');

router.get('/', async (req, res) => {
  const allCategories = await getProductDataLayer.getAllCategories();

  // manually add to the front of all categories an option of 0 (none selected)
  allCategories.unshift([0, '--- Select a Category ---']);

  const allTags = await getProductDataLayer.getAllTags();

  const searchForm = createProductSearchForm(allCategories, allTags);

  // Create a base query (aka a query builder)
  let q = Product.collection();

  searchForm.handle(req, {
    // If empty, display all products
    empty: async (form) => {
      // Select * fro Products
      let products = await q.fetch({
        withRelated: ['category', 'tags'],
      });

      res.render('products/index', {
        products: products.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },

    // if error, also display all products
    error: async (form) => {
      // Select * fro Products
      let products = await q.fetch({
        withRelated: ['category', 'tags'],
      });

      res.render('products/index', {
        products: products.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },

    // if success, render the search
    success: async (form) => {
      const {
        title,
        min_cost,
        max_cost,
        description,
        min_stock,
        max_stock,
        height,
        width,
        category_id,
        tags,
      } = form.data;

      if (title) {
        q = q.where('title', 'like', `%${title}%`);
      }

      if (min_cost) {
        q = q.where('cost', '>=', min_cost);
      }

      if (max_cost) {
        q = q.where('cost', '=<', max_cost);
      }

      if (description) {
        q = q.where('description', 'like', `%${description}%`);
      }

      if (min_stock) {
        q = q.where('stock', '>=', min_stock);
      }

      if (max_stock) {
        q = q.where('stock', '=<', max_stock);
      }

      if (height !== '0') {
        q = q.where('height', '=', height);
      }

      if (width !== '0') {
        q = q.where('width', '=', width);
      }

      if (category_id !== '0') {
        q = q.where('category_id', '=', category_id);
      }

      if (tags) {
        q = q
          .query('join', 'products_tags', 'products.id', 'product_id')
          .where('tag_id', 'in', tags.split(','));
      }

      let products = await q.fetch({
        withRelated: ['category', 'tags'],
      });

      res.render('products/index', {
        products: products.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get('/create', checkIfLoggedIn, async (req, res) => {
  const allCategories = await getProductDataLayer.getAllCategories();

  const allTags = await getProductDataLayer.getAllTags();

  const yesNo = getProductDataLayer.getYesNo();

  const productForm = createProductForm(allCategories, allTags, yesNo);

  res.render('products/create', {
    form: productForm.toHTML(bootstrapField),
    uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
  });
});

router.post('/create', async (req, res) => {
  const allCategories = await getProductDataLayer.getAllCategories();

  const allTags = await getProductDataLayer.getAllTags();

  const yesNo = await getProductDataLayer.getYesNo();

  const productForm = createProductForm(allCategories, allTags, yesNo);

  productForm.handle(req, {
    success: async (form) => {
      let { tags, ...productData } = form.data;

      // Use the product moodel to save a new instance of Product
      const newProduct = new Product();
      newProduct.set(productData);
      // newProduct.set('cost', form.data.cost);
      // newProduct.set('description', form.data.description);
      // newProduct.set('date', form.data.date);
      // newProduct.set('stock', form.data.stock);
      // newProduct.set('height', form.data.height);
      // newProduct.set('width', form.data.width);
      // newProduct.set('category_id', form.data.category_id);
      await newProduct.save();

      if (tags) {
        await newProduct.tags().attach(tags.split(','));
      }

      // Inject flash message
      req.flash(
        'success_messages',
        'New product has been created successfully'
      );
      res.redirect('/products');
    },
    error: (form) => {
      // req.flash('error_messages', 'Please correct all errors and try again');
      res.render('products/create', {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get('/:product_id/update', checkIfLoggedIn, async (req, res) => {
  const allCategories = await getProductDataLayer.getAllCategories();

  const allTags = await getProductDataLayer.getAllTags();

  //1. Get the product that we want to update
  const productToEdit = await getProductDataLayer.getProductById(
    req.params.product_id
  );

  // Option 1
  // const selectedTags = await productToEdit.related('tags').pluck('id');

  // Option 2
  const selectedTags = productToEdit.toJSON().tags.map((t) => t.id);

  const yesNo = await getProductDataLayer.getYesNo();

  const form = createProductForm(allCategories, allTags, yesNo);
  const {
    date_added,
    name,
    description,
    cost,
    company,
    specs,
    stock,
    local,
    organic_natural,
    free_delivery,
    category_id,
    tags,
  } = form.fields;

  date_added.value = productToEdit.get('date_added');
  name.value = productToEdit.get('name');
  description.value = productToEdit.get('description');
  cost.value = productToEdit.get('cost');
  company.value = productToEdit.get('company');
  specs.value = productToEdit.get('specs');
  stock.value = productToEdit.get('stock');
  local.value = productToEdit.get('local');
  organic_natural.value = productToEdit.get('organic_natural');
  free_delivery.value = productToEdit.get('free_delivery');
  category_id.value = productToEdit.get('category_id');

  // Set selected tags to the form to be displayed
  tags.value = selectedTags;
  // form.fields.img_url.value = productToEdit.get('img_url');

  res.render('products/update', {
    form: form.toHTML(bootstrapField),
    product: productToEdit.toJSON(),
    uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
  });
});

router.post('/:product_id/update', async (req, res) => {
  const productToEdit = await getProductDataLayer.getProductById(
    req.params.product_id
  );

  // Option 1
  // const selectedTags = await productToEdit.related('tags').pluck('id');

  // Option 2
  const selectedTags = productToEdit.toJSON().tags.map((t) => t.id);
  const productForm = createProductForm();

  productForm.handle(req, {
    success: async (form) => {
      const { tags, ...productData } = form.data;
      productToEdit.set(productData);
      await productToEdit.save();

      // Update tags
      const newTagsId = tags.split(',');

      // ultra-complex solution
      // // remove all the tags that don't belong to the product
      // // i.e, find all the tags that WERE part of the product but not in the form
      // let toRemove = existingTagsId.filter(id =>
      //     newTagsId.includes(id) === false);
      // await productToEdit.tags().detach(toRemove);

      // // add in all the tags selected in the form
      // // i.e select all the tags that are in the form but not added to the product yet
      // let toAdd = newTagsId.filter(id => existingTagsId.includes(id) === false);
      // await productToEdit.tags().attach(toAdd);

      // smart but not as efficient
      productToEdit.tags().detach(selectedTags);
      productToEdit.tags().attach(newTagsId);

      // Inject flash message
      req.flash('success_messages', 'Product has been updated successfully');

      res.redirect('/products');
    },
    error: (form) => {
      res.render('products/update', {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get('/:product_id/delete', checkIfLoggedIn, async (req, res) => {
  const productToDelete = await getProductDataLayer.getProductById(
    req.params.product_id
  );

  res.render('products/delete', {
    product: productToDelete.toJSON(),
  });
});

router.post('/:product_id/delete', async (req, res) => {
  const productToDelete = await getProductDataLayer.getProductById(
    req.params.product_id
  );

  await productToDelete.destroy();

  req.flash('success_messages', 'Product has been deleted successfully');
  res.redirect('/products');
});

router.get('/addcategorytags', checkIfLoggedIn, (req, res) => {
  const addCategoryTagsForm = addCategoryAddTags();

  res.render('products/addcategorytags', {
    form: addCategoryTagsForm.toHTML(bootstrapField),
  });
});

router.post('/addcategorytags', (req, res) => {
  const addCategoryTagsForm = addCategoryAddTags();

  addCategoryTagsForm.handle(req, {
    success: async (form) => {
      const { category_name, tag_name } = form.data;

      if (category_name) {
        let newCategory = new Category();
        newCategory.set('category_name', category_name);
        await newCategory.save();

        req.flash('success_messages', 'Category / Tag has been added');
        res.redirect('/products/create');
      }

      if (tag_name) {
        const newTag = new Tag();
        newTag.set('tag_name', tag_name);
        await newTag.save();

        req.flash('success_messages', 'Category / Tag has been added');
        res.redirect('/products/create');
      }

      if (!category_name || !tag_name) {
        req.flash('error_messages', 'Please enter a category or tag.');
        res.redirect('/products/addcategorytags');
      }
    },
    error: (form) => {
      res.render('products/addcategorytags', {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

module.exports = router;
