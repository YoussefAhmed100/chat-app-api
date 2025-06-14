import express from "express";
const router = express.Router();

import {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
} from "../utils/validators/user.validator.js";

import {
  createUser,
  getAllUser,
  getSpesificUser,
  updateUser,
  deleteUser,
  changeUserPassword,
} from "../services/user.service.js";

import{allowedTo ,protectRoute}from "../middleWare/auth.middleWare.js"
router.use(protectRoute)

router
  .route("/")
  .get(allowedTo("admin"),getAllUser)
  .post(allowedTo("admin"),createUserValidator, createUser);
  router.route("/update-userProfile/:id").put(updateUserValidator, updateUser)

router
  .route("/:id")
  .get(getUserValidator, getSpesificUser)
  .delete(deleteUserValidator, deleteUser);

// Route for changing user password
router.put("/changePassword/:id", changePasswordValidator, changeUserPassword);

export default router;
