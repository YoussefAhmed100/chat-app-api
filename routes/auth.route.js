import express from "express";
import { signupValidator, loginValidator } from "../utils/validators/auth.validator.js"
import { signup, login,logout } from "../services/auth.service.js";

const router = express.Router();

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/logout").post(logout);


export default router;
