// import the Product model
const { Product, Category, Tag } = require('../models');

const getAllProducts = async () => {
  return await Product.fetchAll();
};

const getAllCategories = async () => {
  const fetchCategories = await Category.fetchAll();
  const allCategories = fetchCategories.map((category) => {
    return [category.get('id'), category.get('category_name')];
  });
  return allCategories;
};

const getAllTags = async () => {
  const fetchTags = await Tag.fetchAll();
  const allTags = fetchTags.map((tag) => {
    return [tag.get('id'), tag.get('tag_name')];
  });
  return allTags;
};

const getYesNo = () => {
  return [
    [true, 'Yes'],
    [false, 'No'],
  ];
};

const getProductById = async (productId) => {
  const product = await Product.where({
    id: productId,
  }).fetch({
    require: true,
    withRelated: ['category', 'tags'],
  });
  return product;
};

module.exports = {
  getAllCategories,
  getAllTags,
  getYesNo,
  getProductById,
  getAllProducts,
};
