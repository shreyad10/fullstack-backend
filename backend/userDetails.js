const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
    name: String,
    age:String,
    email: { type: String, unique: true },
    password: String,
    address : String
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", UserDetailsScehma);
// name, email, age and address 