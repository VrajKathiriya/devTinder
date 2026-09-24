const validator = require("validator");

const validateSignUpData = (req) => {
    const {
        firstName,
        lastName,
        emailId,
        password,
        age,
        gender,
        photoUrl,
        about,
        skills,
    } = req?.body || {};

    // Required fields according to User schema
    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
        throw new Error("First name is required");
    } else if (firstName.trim().length < 2 || firstName.trim().length > 50) {
        throw new Error("First name must be between 2 and 50 characters");
    }

    if (lastName && (typeof lastName !== "string" || lastName.trim().length > 50)) {
        throw new Error("Last name must be a string up to 50 characters");
    }

    if (!emailId || typeof emailId !== "string" || !emailId.trim()) {
        throw new Error("Email ID is required");
    } else if (!validator.isEmail(emailId.trim())) {
        throw new Error("Invalid email address: " + emailId);
    }

    if (!password) {
        throw new Error("Password is required");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }

    // Optional fields validation according to User schema
    if (age !== undefined && age !== null && age !== "") {
        if (isNaN(age) || Number(age) < 18) {
            throw new Error("Age must be at least 18");
        }
    }

    if (gender) {
        if (
            typeof gender !== "string" ||
            !["male", "female", "other"].includes(gender.trim().toLowerCase())
        ) {
            throw new Error(`${gender} is not a valid gender`);
        }
    }

    if (photoUrl) {
        if (typeof photoUrl !== "string" || !validator.isURL(photoUrl)) {
            throw new Error("Invalid URL");
        }
    }

    if (skills !== undefined && skills !== null) {
        if (!Array.isArray(skills)) {
            throw new Error("Skills must be an array");
        } else if (skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }
    }

    if (about && typeof about !== "string") {
        throw new Error("About section must be a string");
    }

    return true;
};

module.exports = validateSignUpData;
