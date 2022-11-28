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
    value: (message, data, data2) => {
      systemLogger.info(`${message} %s`, `: ${data}`);
    },
  },

  systemError: {
    enumerable: true,
    value: (message, data, data2) => {
      systemLogger.error(`${message} %s`, `: ${data}`, `: ${data2}`);
    },
  },
  systemWarn: {
    enumerable: true,
    value: (message, data, data2) => {
      systemLogger.warn(`${message} %s`, `: ${data}`);
    },
  },
  systemDebug: {
    enumerable: true,
    value: (message, data, data2) => {
      systemLogger.debug(`${message} %s`, `: ${data}`);
    },
  },
});
