const { spawn } = require("child_process");
const { exec } = require("child_process");

require("dotenv").config();
const ffmpeg = process.env.FFMPEG_OFFICE;
// const ffmpeg = process.env.FFMPEG_LOCAL;

Object.defineProperties(exports, {
  spawn: {
    enumerable: true,
    value: (command) => {
      return spawn(ffmpeg, command);
    },
  },

  psKill: {
    enumerable: true,
    value: (psId) => {
      exec(`kill -15 ${psId}`).on("close", (code) => {});
    },
  },
});
