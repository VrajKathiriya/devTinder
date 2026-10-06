require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const requestRouter = require("./routes/requests.route");

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
