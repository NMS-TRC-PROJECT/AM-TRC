const Logger = require("@amuzlab/logger")({
  level: "debug",
  transport: "file",
  logDir: "~/log",
  logFileName: "ffmpeg_log",
});

Object.defineProperties(exports, {
  ffmpeg_info: {
    enumerable: true,
    value: (message, data) => {
      Logger.info(`${message} %s`, `: ${data}`);
    },
  },

  ffmpeg_error: {
    enumerable: true,
    value: (message, data) => {
      Logger.error(`${message} %s`, `: ${data}`);
    },
  },
});
