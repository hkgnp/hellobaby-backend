const bookshelf = require('../bookshelf');

// create model for products table
// first argument is the name of the model
// second argument is the config object
// in the example below, the Product model is using the products table
const Product = bookshelf.model('Product', {
  tableName: 'products',

  // ensure name of function is the same as the FK without the "_id"
  category() {
    // First argument is the name of the model
    return this.belongsTo('Category');
  },
  tags() {
    return this.belongsToMany('Tag');
  },
  user() {
    return this.belongsTo('User');
  },
});

const Category = bookshelf.model('Category', {
  tableName: 'categories',

  // ensure name of function is the same as the model but in lowercase and in plural
  products() {
    return this.hasMany('Product');
  },
});

const Tag = bookshelf.model('Tag', {
  tableName: 'tags',
  products() {
    return this.belongsToMany('Product');
  },
});

const User = bookshelf.model('User', {
  tableName: 'users',
  orders() {
    return this.hasMany('Order');
  },
  products() {
    return this.hasMany('Product');
  },
});

const CartItem = bookshelf.model('CartItem', {
  tableName: 'cart_items',
  products() {
    return this.belongsTo('Product');
  },
});

const Order = bookshelf.model('Order', {
  tableName: 'orders',
  status() {
    return this.belongsTo('Status');
  },
  user() {
    return this.belongsTo('User');
  },
});

const Status = bookshelf.model('Status', {
  tableName: 'statuses',
  orders() {
    return this.hasMany('Order');
  },
});

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
  tableName: 'blacklisted_tokens',
});

module.exports = {
  Product,
  Category,
  Tag,
  User,
  CartItem,
  Order,
  Status,
  BlacklistedToken,
};
