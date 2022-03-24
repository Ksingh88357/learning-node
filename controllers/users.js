const methods = {};
const { validationResult } = require("express-validator");
const { bcryptPassword, getToken, googleAuth } = require("../helpers");
const { createUser, findUser } = require("../database/repository/usersRepo");

methods.createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, domain_ids } = req.body;

  try {
    const user = await findUser(email);

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

    return res.json({ token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
};

methods.googleAuth = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token } = req.body;

  try {
    const result = await googleAuth(token);

    return res.json({ result });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
};

module.exports = methods;
