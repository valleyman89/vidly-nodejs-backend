const auth = require("../routes/auth");
const customers = require("../routes/customers");
const error = require("../middleware/error");
const express = require("express");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const returns = require("../routes/returns");
const users = require("../routes/users");
const cors = require("cors");

module.exports = function (app) {
  // SOLVE CORS ERROR
  app.use(cors({ origin: "https://enigmatic-ridge-88618.herokuapp.com" }));

  // MIDDLEWARE
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ROUTES
  app.use("/api/auth", auth);
  app.use("/api/customers", customers);
  app.use("/api/genres", genres);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/returns", returns);
  app.use("/api/users", users);

  // ERROR HANDLING
  app.use(error);
};
