import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "Please enter your fullName"],
      minLength:[5,"your full name must be at least 5 characters"]
    },

    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [6, "Password must be up to 6 characters"],
   
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password =await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;     // ❌ remove sensitive info
  delete user.__v;          // optional: remove version key
  return user;
};

const User = mongoose.model("User", userSchema);
export default User;
