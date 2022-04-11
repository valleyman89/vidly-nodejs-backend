const express = require("express");
const winston = require("winston");
const app = express();

// STARTUP LOGIC
require("./startup/config")();
require("./startup/database")();
require("./startup/logging")(app);
require("./startup/prod")(app);
require("./startup/routes")(app);
require("./startup/validation")();

// LISTEN
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const port = process.env.PORT || 5010;
const server = app.listen(port, () => {
  winston.info(`Listening on port: ${port}.`);
});

module.exports = server;
