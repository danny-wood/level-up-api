const { Role } = require("./models/role");
const { User } = require("./models/user");
const mongoose = require("mongoose");
const config = require("config");

const roles = [
  {
    name: "admin",
    users: [
      {
        firstname: "Danny",
        surname: "Wood",
        email: "dannywood1204@gmail.com",
        password: "password12",
      },
    ],
  },
  {
    name: "user",
    users: [
      {
        firstname: "Dan",
        surname: "Wood",
        email: "dannywoodnewcastle@hotmail.com",
        password: "password12",
      },
    ],
  },
];

async function seedRolesAndUsers() {
  await mongoose.connect(config.get("connectionString"));

  await Role.deleteMany({});
  await User.deleteMany({});

  for (const role of roles) {
    const { _id: roleId } = await new Role({ name: role.name }).save();

    const users = role.users.map((user) => ({
      ...user,
      role: { _id: roleId, name: role.name },
    }));

    await User.insertMany(users);
  }

  mongoose.disconnect();

  console.log("Roles and users seed complete");
}

//seedRolesAndUsers();
