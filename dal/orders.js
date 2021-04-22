const { Status, User, Order, OrderItem } = require('../models');
const getProductDataLayer = require('../dal/products');

const getAllStatuses = async () => {
  const fetchStatuses = await Status.fetchAll();
  const allStatuses = fetchStatuses.map((status) => {
    return { id: status.get('id'), name: status.get('name') };
  });
  return allStatuses;
};

const getAllUsers = async () => {
  const fetchUsers = await User.fetchAll();
  const allUsers = fetchUsers.map((user) => {
    return [user.get('id'), user.get('username'), user.get('email')];
  });
  return allUsers;
};

const getOrderById = async (orderId) => {
  return await Order.where({
    order_id: orderId,
  }).fetch({
    require: false,
  });
};

const getOrderByUser = async (userId) => {
  return await Order.collection()
    .where({
      user_id: userId,
    })
    .fetch({
      withRelated: ['status', 'orderitems', 'products'],
      require: false,
    });
};

const getIdByOrderId = async (orderId) => {
  let order = await Order.collection()
    .where({
      order_id: orderId,
    })
    .fetch({ require: false });
  return await order.toJSON()[0].id;
};

const getOrderItemById = async (orderItemId) => {
  return await OrderItem.where({
    id: orderItemId,
  }).fetch({ require: false });
};

const updateStockAfterCheckoutSuccessful = async (
  productId,
  quantityPurchased
) => {
  const productToUpdate = await getProductDataLayer.getProductById(productId);
  productToUpdate.set(
    'stock',
    productToUpdate.get('stock') - quantityPurchased
  );
  productToUpdate.save();
};

module.exports = {
  getAllStatuses,
  getAllUsers,
  getOrderById,
  getOrderByUser,
  getIdByOrderId,
  getOrderItemById,
  updateStockAfterCheckoutSuccessful,
};
