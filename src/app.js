const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/getUserData", (req, res) => {
  console.log(req.headers);
  throw new Error("This is a test error");
  res.send("This is the login route for user.");
});

app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
