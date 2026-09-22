const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.DATABASE_STRING;

  if (!mongoUri) {
    throw new Error(
      "DATABASE_STRING is not defined. Add it to your .env file.",
    );
  }

  await mongoose.connect(mongoUri);
};

module.exports = connectDB;
