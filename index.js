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

const port = process.env.PORT || 5010;
const server = app.listen(port, () => {
  winston.info(`Listening on port: ${port}.`);
});

module.exports = server;
