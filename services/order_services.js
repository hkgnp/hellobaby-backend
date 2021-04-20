const { Order } = require('../models');

class OrderServices {
  constructor(user_id) {
    this.user_id = user_id;
  }

  addOrder = async (orderId, userId, statusId) => {
    let orderItem = new Order({
      order_id: orderId,
      user_id: userId,
      status_id: statusId,
    });

    await orderItem.save();
    return orderItem;
  };

  addOrderItems = async (orderId, orders) => {};
}

module.exports = OrderServices;
