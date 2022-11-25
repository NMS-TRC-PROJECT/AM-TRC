const Logger = require("@amuzlab/logger"),
  systemLogger = new Logger.Logger({
    level: "debug",
    transport: "file",
    logDir: "~/log",
    logFileName: "system_log",
  });

Object.defineProperties(exports, {
  systemInfo: {
    enumerable: true,
    value: (message, data) => {
      systemLogger.info(`${message} %s`, `: ${data}`);
    },
  },

  systemError: {
    enumerable: true,
    value: (message, data) => {
      systemLogger.error(`${message} %s`, `: ${data}`);
    },
  },
  systemWarn: {
    enumerable: true,
    value: (message, data) => {
      systemLogger.warn(`${message} %s`, `: ${data}`);
    },
  },
  systemDebug: {
    enumerable: true,
    value: (message, data) => {
      systemLogger.debug(`${message} %s`, `: ${data}`);
    },
  },
});
