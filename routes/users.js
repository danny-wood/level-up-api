const auth = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");

router.get("/", auth, async (req, res) => {
  const user = await User.find().select(["-password", "-__v"]);
  res.send(user);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  // Validate request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check the user is not already registered
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  // User has not already been registered, create an instance of a User and map request properties
  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);

  // Save changes to db
  await user.save();

  // Return user with the JWT header, this is to auto login the user, don't return
  // the JWT if you want the auth to confirm their email address
  //TODO: Add email verification to user sign up process
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

//TODO: Add update endpoint
//TODO: Add delete ednpoint

module.exports = router;
