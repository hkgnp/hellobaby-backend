const { User } = require('../models');

const getUserByEmail = async (email) => {
  return await User.where({
    email: email,
  }).fetch({
    require: false,
  });
};

module.exports = { getUserByEmail };
