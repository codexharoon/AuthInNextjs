import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isVerifiedToken: { type: String },
  isVerifiedTokenExpiry: { type: Date },
  forgotPasswordToken: { type: String },
  forgotPasswordTokenExpiry: { type: Date },
});

export default mongoose.models.users || mongoose.model("users", userSchema);
