const methods = {};
const { validationResult } = require("express-validator");
const { bcryptPassword, getToken, checkPassword } = require("../helpers");
const { createUser, findUserByEmail, getUser } = require("../database/repository/usersRepo");

methods.createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    const hashPassword = await bcryptPassword(password);

    const userCreate = await createUser(name, email, hashPassword);

    const payload = {
      user: {
        id: userCreate.id,
      },
    };

    const token = await getToken(payload);

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
};

methods.loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await checkPassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = await getToken(payload);

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
};

methods.getUser = async (req, res) => {
  try {
    const user = await getUser(req.user.id);
    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
};

module.exports = methods;
