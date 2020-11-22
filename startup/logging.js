require("express-async-errors");
const winston = require("winston");
const fs = require("fs");
const path = require("path");
const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

module.exports = function () {
  // In this version of winston this only works for uncaught exceptions and not unhandled rejections
  // This is why we throw the unhandled rejection below this codeblock
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({
      colorize: true,
      prettyPrint: true,
      filename: path.join(logDir, "/uncaughtExceptions.log"),
    })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(winston.transports.File, {
    filename: path.join(logDir, "/global.log"),
  });
};
