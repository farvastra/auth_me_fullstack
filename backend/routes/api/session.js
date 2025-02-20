const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {  restoreUser } = require("../../utils/auth"); // Updated middleware

const router = express.Router();
const { jwtConfig } = require("../../config");
const { secret, expiresIn } = jwtConfig;

// Validation for user login
const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

//  Login User
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  console.log("Attempting login for:", credential);
  const user = await User.login({ credential, password });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JWT Token
  const token = jwt.sign({ id: user.id }, secret, { expiresIn });
 console.log(token)
  return res.json({
    user: user.toSafeObject(),
    token, 
  });
});

// Logout 
router.delete("/", (_req, res) => {
  return res.json({ message: "Logged out " });
});

//  Get the Current User (Requires JWT)
router.get("/", restoreUser, (req, res) => {
  if (!req.user) {
    console.log("User not found in request");
    return res.status(401).json({
      message: "Unauthorized: You must be signed in to access this resource.",
    });
  }

  return res.json({ user: req.user.toSafeObject() });
});



module.exports = router;
