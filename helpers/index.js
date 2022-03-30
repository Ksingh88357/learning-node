const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const JWT_SECRET = process.env.JWT_SECRET;

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
      JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        resolve(token);
      }
    );
  });
};

module.exports = {
  uploadImage,
  bcryptPassword,
  getToken,
  checkPassword,
};
