import argon2 from "argon2";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["USER", "RESOLVER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await argon2.hash(this.password); 
  return next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return argon2.verify(this.password, password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
