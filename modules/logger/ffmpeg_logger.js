const Logger = require("@amuzlab/logger"),
  ffmpeg_logger = new Logger.Logger({
    level: "debug",
    transport: "file",
    logDir: "~/log",
    logFileName: "ffmpeg_log",
  });

Object.defineProperties(exports, {
  ffmpeg_info: {
    enumerable: true,
    value: (message, data) => {
      ffmpeg_logger.info(`${message} %s`, `: ${data}`);
    },
  },

  ffmpeg_error: {
    enumerable: true,
    value: (message, data) => {
      ffmpeg_logger.error(`${message} %s`, `: ${data}`);
    },
  },
});
