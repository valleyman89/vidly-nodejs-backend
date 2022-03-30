const config = require("config");

module.exports = function (app) {
  // CONFIG ENVIRONMENT VARIABLES
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: Key not defined");
  }
};
