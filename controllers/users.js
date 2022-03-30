const methods = {};
const { validationResult } = require("express-validator");
const { OAuth2Client } = require("google-auth-library");
const { bcryptPassword, getToken, checkPassword } = require("../helpers");
const {
  createUser,
  findUserByEmail,
  getUser,
  getUsers,
  findUserById,
  updateUser,
  deleteUser,
} = require("../database/repository/usersRepo");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

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

methods.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await getUsers(page, limit);
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
};

methods.getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
};

methods.updateUser = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body.name);
    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
};

methods.deleteUser = async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);
    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
};

methods.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const result = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const { name, email } = result.getPayload();
    
    const password = "12345678";

    const user = await findUserByEmail(email);

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    const hashPassword = await bcryptPassword(password);

    const userCreate = await createUser(name, email, hashPassword, "GOOGLE");

    const payload = {
      user: {
        id: userCreate.id,
      },
    };

    const jwtToken = await getToken(payload);

    return res.status(200).json({ token: jwtToken });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
};

module.exports = methods;
