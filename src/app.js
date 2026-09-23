require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log("hello", req.body);

  try {
    // const existingUser = await User.findOne({ emailId: req.body.emailId });

    // if (existingUser) {
    //   return res.status(409).send("User with this email already exists");
    // }

    const user = new User(req.body);
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(500).send("Error creating user: " + error.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });

    if (user.length === 0) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error fetching user: " + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error fetching users: " + error.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.userId);

    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  const ALLOWED_FIELDS = [
    "userId",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  try {
    const isUpdateAllowed = Object.keys(data).every((field) =>
      ALLOWED_FIELDS.includes(field),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });

    console.log("update user", user);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully1");
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to the database");

    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
