Object.defineProperties(exports, {
  systemLogger: { enumerable: true, value: require("./systemLogger") },
  ffmpegLogger: { enumerable: true, value: require("./ffmpegLogger") },
  sendstatusLogger: { enumerable: true, value: require("./") },

  loggerChoicer: {
    enumerable: true,
    value: {
      ffmpegLogger: true,
      ffmpegLogger2: true,
    },
  },
});
