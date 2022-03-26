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

module.exports = {
  createUser,
  findUserByEmail,
  getUser
};
