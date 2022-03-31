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
const port = process.env.port;
const server = app.listen(port, () => {
  winston.info(`Listening on port: ${port}.`);
});

module.exports = server;
