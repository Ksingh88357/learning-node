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

const getUsers = () => {
  return User.find().select("-password");
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
