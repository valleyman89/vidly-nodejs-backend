const winston = require("winston");
//require("winston-mongodb");
require("express-async-errors");

module.exports = function (app) {
  winston.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info",
    })
  );

  winston.add(
    new winston.transports.Console({
      level: "info",
    })
  );

  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: "mongodb://localhost:27017/vidly",
  //     level: "error",
  //   })
  // );

  // ROUTE LOGGING
  app.use((req, res, next) => {
    winston.info(`${req.method} ${req.url}`);
    next();
  });

  // UNCAUGHT EXCEPTIONS
  new winston.ExceptionHandler(
    new winston.transports.File({ filename: "logs/uncaughtexceptions.log" }),
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );
  process.on("uncaughtException", (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
