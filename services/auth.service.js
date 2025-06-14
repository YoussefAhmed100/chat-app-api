import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import ApiError from "../utils/apiError.js";
import UserModel from "../models/user.model.js";
import generateTokens from "../utils/generateTokens.js";

// @desc Signup
// @route POST /api/v1/auth/signup
// @access Public
export const signup = asyncHandler(async (req, res, next) => {
  const newUser = await UserModel.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    profilePic:req.body.profilePic,
    role:req.body.role

  });

  const token = generateTokens(newUser._id,res);
  await newUser.save()
  res.status(201).json({ data: newUser, token });
});

// @desc Login
// @route POST /api/v1/auth/login
// @access Public
export const login = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const token = generateTokens(user._id,res);
  res.status(200).json({ data: user, token });
});
// @desc Logout
// @route POST /api/v1/auth/logout
// @access Public
export const logout = asyncHandler(async (req, res, next) => {
 
  res.cookie('jwt',"",{maxAge:0})
  res.status(200).json({message:"logged out successfully"})


});




