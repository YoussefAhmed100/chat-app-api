import slugify from "slugify";
import { check, body } from "express-validator";
import bcrypt from "bcrypt";

import validationMiddleware from "../../middleWare/validatorMiddleware.js";
import userModel from "../../models/user.model.js";

export const createUserValidator = [
 
  check("fullName")
    .notEmpty()
    .withMessage(" name is required")
    .isLength({ min: 5, max: 50 })
    .withMessage(" name must be between 5 and 50 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already exists");
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required"),

  check("role").optional(),
  validationMiddleware,
];

export const getUserValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  validationMiddleware,
];

export const updateUserValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),

  body("fullName").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email address")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already exists");
        }
      })
    ),
 
  check("role").optional(),
  validationMiddleware,
];

export const deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  validationMiddleware,
];

export const changePasswordValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  body("currentPassword").notEmpty().withMessage("current password required"),
  body("confirmPassword").notEmpty().withMessage("confirm password is required"),
  body("password")
    .notEmpty()
    .withMessage("new password is required")
    .custom(async (value, { req }) => {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error(`there is no user for this id :${req.params.id}`);
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error("Incorrect current password ");
      }

      if (value !== req.body.confirmPassword) {
        throw new Error("password and confirm password must be the same");
      }

      return true;
    }),
  validationMiddleware,
];
