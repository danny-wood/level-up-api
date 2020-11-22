const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");

router.post("/login", async (req, res) => {
  // Validate request
  const { error } = validate(req.body, false);
  if (error) return res.status(400).send(error.details[0].message);

  // Find the user, if user can't be found return 400 error
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  // Validate password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  // Auth was successful, return JWT
  const token = user.generateAuthToken();
  res.send({ token });
});

module.exports = router;
