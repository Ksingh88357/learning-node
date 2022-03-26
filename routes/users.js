const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const usersController = require("../controllers/users");

// @route   POST api/users
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

module.exports = router;
