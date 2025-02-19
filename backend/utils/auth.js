const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');
const SECRET_KEY = process.env.JWT_SECRET;
const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
    // Create the token.
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        { expiresIn: parseInt(expiresIn) }
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, 
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};


const requireAuth = (req, res, next) => {
    console.log("Authorization Header:", req.headers.authorization);  
  
    const token = req.header("Authorization")?.split(" ")[1];
  
    console.log("Extracted Token:", token);  
  
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);  
      req.user = decoded;
      next();
    } catch (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
  
  
const restoreUser = async (req, res, next) => {
    const token = req.cookies.token; 
  
    if (!token) {
      console.log("No token found in cookies");
      return next(); 
    }
  
    try {
      const decoded = jwt.verify(token, secret);
      console.log("Decoded Token:", decoded);
  
      const user = await User.findByPk(decoded.id);
      if (!user) {
        console.log("User not found in database");
        return next();
      }
  
      req.user = user;
      next();
    } catch (err) {
      console.log("JWT Error:", err.message);
      return next();
    }
  };

module.exports = { setTokenCookie, restoreUser, requireAuth };