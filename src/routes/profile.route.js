const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user)
  } catch (error) {
    return res.status(403).send("Forbidden")
  }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Data")
    }

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    })

    await loggedInUser.save();
    res.json({ success: true, message: `${loggedInUser.firstName}'s profile has been updated`, data: loggedInUser })

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message })
  }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new Error("Both currentPassword and newPassword are required");
    }

    const loggedInUser = req.user;

    // 1. Verify current password
    const isCurrentPasswordValid = await loggedInUser.validatePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // 2. Ensure new password is not identical to current password
    if (currentPassword === newPassword) {
      throw new Error("New password cannot be the same as current password");
    }

    // 3. Validate new password strength
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("New password is not strong enough");
    }

    // 4. Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Update password and save
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = profileRouter;