const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const usersController = require("../controllers/users");
const auth = require("../middleware/auth");

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

// @route   POST api/users/login
// @desc    Login User
// @access  Public
router.post(
  `/login`,
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  usersController.loginUser
);

// @route   GET api/users
// @desc    Get User
// @access  Private
router.get(`/`, auth, usersController.getUser);

module.exports = router;
