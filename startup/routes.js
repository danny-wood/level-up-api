const express = require("express");
const helmet = require("helmet");
const error = require("../middleware/error");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function (app) {
  //* Add middleware
  // Enable json in express
  app.use(express.json());
  // Set deafult security settings for HTTP headers
  app.use(helmet());
  // Error logging middleware
  app.use(error);

  //* Add routes
  app.use("/api/users", users);
  app.use("/api/auth", auth);
};
