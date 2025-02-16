const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { ValidationError } = require("sequelize");
const { environment } = require("./config");
const isProduction = environment === "production";
const session = require("express-session");

const routes = require("./routes");

const app = express();
app.use(
  cors({
    origin: "https://spots-app.onrender.com", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"], 
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());



app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// 
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);
app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",  
    sameSite: "lax", 
    httpOnly: true
  }
}));


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
