const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const { roleSchema } = require("./role");
// TODO: Implement password complexity in User validation.
//const passwordComplexity = require("joi-password-complexity");

// Define user model schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  surname: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024, // Passwords will be hashed in the database
  },
  role: {
    type: roleSchema,
    required: true,
  },
});

// Create a custom method for generating the user auth token
// If we use the regular function syntax (not arrow function), we can call the 'this'
// keyword and access the User properties, as we are creating a method in the User model.
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

// Define user model
const User = mongoose.model("User", userSchema);

// Validate function for user object, option to exclude name validation for login endpoint in auth route
function validateUser(user, validateName = true) {
  const schema = Joi.object({
    ...(validateName && {
      firstname: Joi.string().min(1).max(50).required(),
      surname: Joi.string().min(1).max(50).required(),
    }),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    //TODO: add role to validation
  });

  return schema.validate(user);
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;
