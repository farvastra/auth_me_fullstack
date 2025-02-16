const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csrf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { ValidationError } = require("sequelize");
const { environment } = require("./config");
const routes = require("./routes");

const isProduction = environment === "production";

const app = express();

// ✅ Allow CORS for specific origins
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://spots-app.onrender.com", // Deployed frontend
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token, XSRF-TOKEN");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);


app.use((req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    httpOnly: false,
    secure: isProduction,
    sameSite: "Lax",
  });
  next();
});

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);



app.use(routes);


app.get("/csrf/restore", (req, res) => {
  res.json({ "XSRF-TOKEN": req.csrfToken() });
});


app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});

app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = "Validation error";
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;
