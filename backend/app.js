// const express = require("express");
// require("express-async-errors");
// const morgan = require("morgan");
// const cors = require("cors");
// const csurf = require("csurf");
// const helmet = require("helmet");
// const cookieParser = require("cookie-parser");
// const { ValidationError } = require("sequelize");
// const { environment } = require("./config");
// const isProduction = environment === "production";

// const routes = require("./routes");

// const app = express();

// app.use(morgan("dev"));
// app.use(cookieParser());
// app.use(express.json());


// const allowedOrigins = [
//   "http://localhost:3000", 
//   "https://spots-app.onrender.com",
// ];

// app.use(cors({
//   origin: ["http://localhost:3000", "https://spots-app.onrender.com"],
//   credentials: true,
// }));

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token, XSRF-TOKEN");
//   res.setHeader("Access-Control-Allow-Credentials", "true");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });


// app.use(
//   helmet.crossOriginResourcePolicy({
//     policy: "cross-origin",
//   })
// );

// app.use(csurf({
//   cookie: {
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "Lax",
//     httpOnly: true,
//   },
// }));

// app.use((req, res, next) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken(), {
//     httpOnly: false,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "Lax",
//   });
//   next();
// });

// app.use(routes);

// app.get("/", (req, res) => {
//   res.send("Hello, this is the root endpoint of your API!");
// });
// app.use((_req, _res, next) => {
//   const err = new Error("The requested resource couldn't be found.");
//   err.title = "Resource Not Found";
//   err.errors = ["The requested resource couldn't be found."];
//   err.status = 404;
//   next(err);
// });

// app.use((err, _req, _res, next) => {
//   // check if error is a Sequelize error:
//   if (err instanceof ValidationError) {
//     err.errors = err.errors.map((e) => e.message);
//     err.title = "Validation error";
//   }
//   next(err);
// });

// app.use((err, _req, res, _next) => {
//   res.status(err.status || 500);
//   console.error(err);
//   res.json({
//     title: err.title || "Server Error",
//     message: err.message,
//     errors: err.errors,
//     stack: isProduction ? null : err.stack,
//   });
// });

// module.exports = app;

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

const routes = require("./routes");

const app = express();

app.use(morgan("dev"));

// Use cookieParser with a secret so it can sign cookies
app.use(cookieParser("secret"));

// Use express.json to parse JSON request bodies
app.use(express.json());

// Set up CORS to allow your frontend to communicate with the backend
app.use(
  cors({
    origin: ["http://localhost:3000", "https://spots-app.onrender.com"],
    credentials: true,
  })
);

// Optionally, allow OPTIONS requests
app.options("*", cors());

// Use helmet for basic security
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Use cookie-session middleware to enable session-based storage
app.use(
  cookieSession({
    name: "session",
    secret: "secret2", // Use a strong secret here
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // In production, you might set secure: true (requires HTTPS)
    secure: isProduction,
  })
);

// Initialize csurf without the cookie option (session-based CSRF)
app.use(csurf());

// Middleware to set the CSRF token in a cookie accessible by client-side JavaScript
app.use((req, res, next) => {
  // This generates a token based on the secret stored in req.session.csrfSecret
  const token = req.csrfToken();
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: false, // Allow client-side JavaScript to read it
    secure: isProduction,
    sameSite: "Lax",
  });
  next();
});

// Mount your application routes
app.use(routes);

// Define a simple root route
app.get("/", (req, res) => {
  res.send("Hello, this is the root endpoint of your API!");
});

// 404 Error Handler
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});

// Handle Sequelize ValidationErrors
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = "Validation error";
  }
  next(err);
});

// Global Error Handler, including CSRF errors
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
