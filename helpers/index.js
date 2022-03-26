const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

const uploadImage = (image) => {
  try {
    const fileName = Date.now() + ".png";
    const path = "./images/" + fileName;
    const imgdata = image;
    const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    fs.writeFileSync(path, base64Data, { encoding: "base64" });
    return fileName;
  } catch (err) {
    return false;
  }
};

const bcryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const bcryptedPassword = await bcrypt.hash(password, salt);
  return bcryptedPassword;
};

const checkPassword = async (inputPassword, dbPassword) => {
  const match = await bcrypt.compare(inputPassword, dbPassword);
  return match;
};

const getToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        resolve(token);
      }
    );
  });
};

const googleAuth = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log(`User ${payload.name} verified`);
  const { sub, email, name, picture } = payload;
  const userId = sub;
  return { userId, email, fullName: name, photoUrl: picture };
};

module.exports = {
  uploadImage,
  bcryptPassword,
  getToken,
  checkPassword,
  googleAuth,
};
