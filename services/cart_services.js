const { CartItem } = require('../models');
const getCartDataLayer = require('../dal/cart_items');

class CartServices {
  constructor(user_id) {
    this.user_id = user_id;
  }

  getAll = async () => {
    const allItems = await getCartDataLayer.getAllItems(this.user_id);
    return allItems;
  };

  addToCart = async (productId, quantity) => {
    // Check if the item already exists
    let cartItem = await getCartDataLayer.getCartItemByUserAndProduct(
      this.user_id,
      productId
    );

    // If the item does not exist
    if (!cartItem) {
      cartItem = new CartItem({
        user_id: this.user_id,
        product_id: productId,
        quantity: quantity,
      });
    } else {
      cartItem.set('quantity', cartItem.get('quantity') + quantity);
    }
    await cartItem.save();
    return cartItem;
  };

  async removeItem(productId) {
    return await getCartDataLayer.removeItem(this.user_id, productId);
  }

  updateQuantity = async (productId, newQuantity) => {
    return await getCartDataLayer.updateQuantity(
      this.user_id,
      productId,
      newQuantity
    );
  };
}

module.exports = CartServices;
