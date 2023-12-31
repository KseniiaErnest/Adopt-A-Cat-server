const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'], 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    fullName: String,
    role: { type: String, enum: ['Adopter', 'Cat Owner'], required: true },
    preferredSpecies: { type: String, enum: ['Cat', 'Dog'], default: 'Cat' },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
