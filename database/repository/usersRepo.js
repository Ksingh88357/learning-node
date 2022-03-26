const User = require("../models/User");

const createUser = (name, email, password) => {
  let user = new User({
    name,
    email,
    password,
  });
  return user.save();
};

const findUserByEmail = (email) => {
  return User.findOne({ email });
};

const getUser = (_id) => {
  return User.findOne({ _id }).select("-password");
};

const getUsers = async (page, limit) => {
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  const count = await User.countDocuments();
  return {
    users,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

const findUserById = (_id) => {
  return User.findOne({ _id });
};

const updateUser = (_id, name) => {
  return User.findByIdAndUpdate(
    { _id },
    { $set: { name } },
    { new: true }
  ).select("-password");
};

const deleteUser = (_id) => {
  return User.deleteOne({ _id }).select("-password");
};

module.exports = {
  createUser,
  findUserByEmail,
  getUser,
  getUsers,
  findUserById,
  updateUser,
  deleteUser,
};
