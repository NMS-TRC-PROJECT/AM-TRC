const Logger = require("@amuzlab/logger"),
  ffmpegLogger = new Logger.Logger({
    level: "debug",
    transport: "file",
    logDir: "~/log",
    logFileName: "ffmpeg_log",
  });

Object.defineProperties(exports, {
  Info: {
    enumerable: true,
    value: (message, data) => {
      ffmpegLogger.info(`${message} %s`, `: ${data}`);
    },
  },

  Error: {
    enumerable: true,
    value: (message, data) => {
      ffmpegLogger.error(`${message} %s`, `: ${data}`);
    },
  },
  Warn: {
    enumerable: true,
    value: (message, data) => {
      ffmpegLogger.warn(`${message} %s`, `: ${data}`);
    },
  },
  Debug: {
    enumerable: true,
    value: (message, data) => {
      ffmpegLogger.debug(`${message} %s`, `: ${data}`);
    },
  },
});
