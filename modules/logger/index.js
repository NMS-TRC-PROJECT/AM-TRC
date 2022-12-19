Object.defineProperties(exports, {
  systemLogger: { enumerable: true, value: require("./systemLogger") },
  ffmpegLogger: { enumerable: true, value: require("./ffmpegLogger") },

  loggerChoicer: {
    enumerable: true,
    value: {
      ffmpegLogger: true,
      ffmpegLogger2: true,
    },
  },
});
