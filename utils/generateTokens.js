import jwt from "jsonwebtoken";


/**
 * Generate JWT token and set it in cookie
 * @param {string} userId
 * @param {object} res - Express response object
 * @returns {string} token
 */
const generateTokens = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
    
  });


res.cookie("jwt", token, {
  maxAge: process.env.COOKIE_MAX_AGE, // 7 days in milliseconds
  httpOnly: true, // (helps protect against XSS attacks)
  sameSite: "Strict", // 🔐 (helps prevent CSRF attacks)
  secure: process.env.NODE_ENV !== "development", // Transmit the cookie only over HTTPS in production
});

  return token;
};

export default generateTokens;
