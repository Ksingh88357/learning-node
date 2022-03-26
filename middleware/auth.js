const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { getUser } = require("../database/repository/usersRepo");
const { getUserDomainIds } = require("../database/repository/userDomainsRepo");

module.exports = async function (req, res, next) {
  // Get token from the header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    const user = await getUser(req.user.id);
    req.user.role = user.role;
    req.user.domain_ids = await getUserDomainIds(req.user.id, req.user.role);
    if(req.user.domain_ids.length === 0 && req.user.role === "USER") {
      return res.status(401).json({ msg: "Please check with ADMIN for the domains access!" });
    }else{
      next();
    }
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
