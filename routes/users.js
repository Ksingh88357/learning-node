const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const usersController = require("../controllers/users");

// @route   POST api/users/createUser
// @desc    Create User
// @access  Public
router.post(
  `/`,
  [
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  usersController.createUser
);

// @route   POST api/users/googleAuth
// @desc    Create User
// @access  Public
router.post(
  `/`,
  [
    check("token", "Token is Required").not().isEmpty()
  ],
  usersController.googleAuth
);

module.exports = router;
