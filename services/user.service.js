import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import ApiError from "../utils/apiError.js";
import UserModel from "../models/user.model.js";
import * as factory from "./handler.factory.js";

// @desc Create user
// @route POST /api/users
// @access Private
export const createUser = factory.createOne(UserModel);

// @desc Get list of users
// @route GET /api/users
// @access Private
export const getAllUser = factory.getAll(UserModel);

// @desc Get specific user
// @route GET /api/users/:id
// @access Private
export const getSpesificUser = factory.getOne(UserModel);

// @desc Update specific user
// @route PUT /api/users/:id
// @access Private
export const updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      fullName: req.body.fullName,
      slug: req.body.slug,
      email: req.body.email,
      profilePic:req.body.profilePic,
      role: req.body.role,

    },
    { new: true }
  );

  if (!document) {
    return next(new ApiError(`No document found for id: ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

// @desc Change user password
// @route PUT /api/users/:id/change-password
// @access Private
export const changeUserPassword = asyncHandler(async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: hashedPassword,
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!document) {
    return next(new ApiError(`No document found for id: ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

// @desc Delete specific user
// @route DELETE /api/users/:id
// @access Private
export const deleteUser = factory.deleteOne(UserModel);
