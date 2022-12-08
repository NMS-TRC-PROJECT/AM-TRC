Object.defineProperties(exports, {
  ffmpegLogger: { enumerable: true, value: require("./ffmpegLogger") },
  systemLogger: { enumerable: true, value: require("./systemLogger") },

  loggerChoicer: {
    enumerable: true,
    value: {
      ffmpegLogger: true,
      ffmpegLogger2: true,
    },
  },
});
