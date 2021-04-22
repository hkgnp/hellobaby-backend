const { Order, OrderItem } = require('../models');

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

  addOrderItems = async (userId, orderId, orders) => {
    const ordersObject = JSON.parse(orders);

    for (let o of ordersObject) {
      let orderItem = new OrderItem({
        order_id: orderId,
        user_id: userId,
        product_id: o.product_id,
        quantity: o.quantity,
      });
      orderItem.save();
    }
  };
}

module.exports = OrderServices;
