import slugify from "slugify";
import { check } from "express-validator";

import validationMiddleware from "../../middleWare/validatorMiddleware.js";
import userModel from "../../models/user.model.js";

export const signupValidator = [
check("fullName")
  .notEmpty().withMessage("Name is required")
  .isLength({ min: 5, max: 50 }).withMessage("Name must be between 5 and 50 characters")
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

  validationMiddleware,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),

  validationMiddleware,
];
