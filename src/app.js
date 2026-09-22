const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getAllData", adminAuth, (req, res) => {
  res.send("This is the getAllData route for admin.");
});

app.get("/user/login", (req, res) => {
  res.send("This is the login route for user.");
});

app.get("/user/getAllData", userAuth, (req, res) => {
  res.send("This is the getAllData route for user.");
});

app.get(
  "/hello",
  (req, res, next) => {
    console.log("First callback function executed.");
    // res.send("Hello, World!");
    next();
  },
  (req, res) => {
    console.log("Second callback function executed.");
    res.send("This is the second callback function.");
  },
);

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
