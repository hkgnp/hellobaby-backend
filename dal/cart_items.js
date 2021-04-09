const { CartItem } = require('../models');

const getAllItems = async (userId) => {
  return await CartItem.collection()
    .where({
      user_id: userId,
    })
    .fetch({
      require: false,
      withRelated: ['products'],
    });
};

const getCartItemByUserAndProduct = async (userId, productId) => {
  return await CartItem.where({
    user_id: userId,
    product_id: productId,
  }).fetch({
    require: false,
  });
};

removeItem = async (userId, productId) => {
  const item = await getCartItemByUserAndProduct(userId, productId);
  if (item) {
    item.destroy();
    return true;
  }
  return false;
};

const updateQuantity = async (userId, productId, newQuantity) => {
  const item = await getCartItemByUserAndProduct(userId, productId);
  if (item) {
    item.set('quantity', newQuantity);
    item.save();
    return item;
  } else {
    return null;
  }
};

module.exports = {
  getAllItems,
  getCartItemByUserAndProduct,
  removeItem,
  updateQuantity,
};
