const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
});

const Role = mongoose.model("Role", roleSchema);

exports.roleSchema = roleSchema;
exports.Role = Role;
