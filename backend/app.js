const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const { ValidationError } = require("sequelize");
const { environment } = require("./config");
const isProduction = environment === "production";
const path = require("path");

const routes = require("./routes");

const app = express();

app.use(morgan("dev"));
app.use(cookieParser("secret"));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://spots-app.onrender.com"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(
  cookieSession({
    name: "session",
    secret: "secret2",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: isProduction,
  })
);


app.use(routes);

app.get("/", (req, res) => {
  res.send("Hello, this is the root endpoint of your API!");
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
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({
      title: "CSRF Token Error",
      message: "Invalid CSRF token. Please refresh the page and try again.",
      errors: [err.message],
    });
  }
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
