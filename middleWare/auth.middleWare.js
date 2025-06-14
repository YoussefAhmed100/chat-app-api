import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

// Middleware to protect routes - ensures the user is authenticated

export const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Get token from either Authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  // 2. If token is missing
  if (!token) {
    res.status(401);
    throw new Error("Unauthorized - No token provided");
  }

  // 3. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 4. Find user and attach to request
  const user = await User.findById(decoded.userId)
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  req.user = user;
  next();
});
// @desc Role-based access control middleware
export const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to access this route", 403)
      );
    }
    next();
  });
