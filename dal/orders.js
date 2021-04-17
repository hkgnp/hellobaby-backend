const { Status, User } = require('../models');

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

module.exports = { getAllStatuses, getAllUsers };
