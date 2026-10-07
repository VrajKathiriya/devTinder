const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
  const { token } = req.cookies

  try {
    if (!token) {
      throw new Error("Token is not valid!!!!");
    }

    const decodedMsg = jwt.verify(token, process.env.JWT_SECRET)
    const { id } = decodedMsg;

    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found")
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).send("Error in user authentication: " + err.message)
  }
};

module.exports = { userAuth };
