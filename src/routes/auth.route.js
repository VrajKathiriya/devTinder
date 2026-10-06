const express = require("express");
const User = require("../models/user")
const validateSignUpData = require("../utils/validations")
const bcrypt = require("bcrypt")

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const user = new User(req.body);
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(500).send("Error creating user: " + error.message);
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }
    const isPasswordValid = user.validatePassword(req.body.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }
    // create a token
    const token = user.getJWT();

    // send token in cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    res.send("User logged in successfully");
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("User logged out successfully");
  } catch (error) {
    res.status(500).send("Error logging out: " + error.message);
  }
})


module.exports = authRouter;