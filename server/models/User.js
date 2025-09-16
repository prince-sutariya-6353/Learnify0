// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // don’t return password by default
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows null for non-Google users
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
