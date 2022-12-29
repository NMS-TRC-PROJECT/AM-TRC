const Logger = require("@amuzlab/logger"),
  ffmpegLogger2 = new Logger.Logger({
    level: "debug",
    transport: "file",
    logDir: "~/log",
    logFileName: "ffmpeg_log2",
  });

Object.defineProperties(exports, {
  Info: {
    enumerable: true,
    value: (message, data) => {
      ffmpegLogger2.info(`${message} %s`, `: ${data}`);
    },
  },

  Error: {
    enumerable: true,
    value: (message, data) => {
      ffmpegLogger2.error(`${message} %s`, `: ${data}`);
    },
  },
  Warn: {
    enumerable: true,
    value: (message, data) => {
      ffmpegLogger2.warn(`${message} %s`, `: ${data}`);
    },
  },
  Debug: {
    enumerable: true,
    value: (message, data) => {
      ffmpegLogger2.debug(`${message} %s`, `: ${data}`);
    },
  },
});
