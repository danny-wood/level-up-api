const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    // If the JWT is valid we will get the object we originally encoded into the JWT (user id, name, etc)
    // If invalid this will return false.
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
