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
  return db.createTable('products', {
    id: { type: 'int', unsigned: true, primaryKey: true, autoIncrement: true },
    name: { type: 'string', length: 100 },
    description: { type: 'string', length: 800 },
    cost: { type: 'int' },
    company: { type: 'string', length: 100 },
    size: { type: 'string', length: 100 },
    stock: { type: 'int' },
    local: { type: 'boolean' },
    organic_natural: { type: 'boolean' },
    free_delivery: { type: 'boolean' },
  });
};

exports.down = function (db) {
  return db.dropTable('categories');
};

exports._meta = {
  version: 1,
};
