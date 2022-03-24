const User = require("../models/User");

const createUser = (name, email, password) => {
  let user = new User({
    name,
    email,
    password,
  });
  return user.save();
};

const findUser = (email) => {
  return User.findOne({ email });
};

module.exports = {
  createUser,
  findUser,
};
