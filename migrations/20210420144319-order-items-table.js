'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('order_items', {
    id: { type: 'int', unsigned: true, primaryKey: true, autoIncrement: true },
    quantity: { type: 'int' },
    product_id: {
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'order_items_product',
        table: 'products',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict',
        },
      },
    },
    user_id: {
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'order_items_userid',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict',
        },
      },
    },
    order_id: {
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'order_items_orderid',
        table: 'orders',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict',
        },
      },
    },
  });
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
