const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.use(express.urlencoded({ extended: false }));
require("./userDetails");

const jwt = require("jsonwebtoken");

const mongoUrl =
  "mongodb+srv://Shreyad:ULCn2m1OMNHF7ME0@cluster0.ufn2trt.mongodb.net/fullstack-login-page";

const JWT_SECRET = 'yourkeyissupposedtobesecret'

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => console.log(err));

  // register
  const User = mongoose.model("UserInfo");
  app.post("/register", async (req, res) => {
    const { name, age, email, password, address } = req.body;
  
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.json({ error: "User Exists" });
      }
      await User.create({
        name,
        age,
        email,
        password: encryptedPassword,
        address,
      });
      res.send({ status: "ok" });
    } catch (error) {
      res.send({ status: "error" });
    }
  });

  app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "User Not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "15m",
      });
  
      if (res.status(201)) {
        return res.json({ status: "ok", data: token });
      } else {
        return res.json({ error: "error" });
      }
    }
    res.json({ status: "error", error: "Invalid Password" });
  });

  app.listen(5000, ()=>{
    console.log("Server connected")
  })

  app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET, (err, res) => {
        if (err) {
          return "token expired";
        }
        return res;
      });
      console.log(user);
      if (user == "token expired") {
        return res.send({ status: "error", data: "token expired" });
      }
  
      const useremail = user.email;
      User.findOne({ email: useremail })
        .then((data) => {
          res.send({ status: "ok", data: data });
        })
        .catch((error) => {
          res.send({ status: "error", data: error });
        });
    } catch (error) {}
  });