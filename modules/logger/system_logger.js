const Logger = require("@amuzlab/logger"),
  system_logger = new Logger.Logger({
    level: "debug",
    transport: "file",
    logDir: "~/log",
    logFileName: "system_log",
  });

Object.defineProperties(exports, {
  system_info: {
    enumerable: true,
    value: (message, data) => {
      system_logger.info(`${message} %s`, `: ${data}`);
    },
  },

  system_error: {
    enumerable: true,
    value: (message, data) => {
      system_logger.error(`${message} %s`, `: ${data}`);
    },
  },
});
