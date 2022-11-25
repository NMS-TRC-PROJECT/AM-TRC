const Logger = require("@amuzlab/logger"),
  ffmpegLogger = new Logger.Logger({
    level: "debug",
    transport: "file",
    logDir: "~/log",
    logFileName: "ffmpeg_log",
  });

Object.defineProperties(exports, {
  ffmpegInfo: {
    enumerable: true,
    value: (message, data) => {
      ffmpegLogger.info(`${message} %s`, `: ${data}`);
    },
  },

  ffmpegError: {
    enumerable: true,
    value: (message, data) => {
      ffmpegLogger.error(`${message} %s`, `: ${data}`);
    },
  },
  ffmpegWarn: {
    enumerable: true,
    value: (message, data) => {
      ffmpegLogger.warn(`${message} %s`, `: ${data}`);
    },
  },
  ffmpegDebug: {
    enumerable: true,
    value: (message, data) => {
      ffmpegLogger.debug(`${message} %s`, `: ${data}`);
    },
  },
});
