const { spawn } = require("child_process");
const { exec } = require("child_process");

require("dotenv").config();
// const ffmpeg = process.env.FFMPEG_OFFICE;

const ffmpeg = process.env.FFMPEG_LOCAL;

Object.defineProperties(exports, {
  spawn: {
    enumerable: true,
    value: (command) => {
      const ts = spawn(ffmpeg, command);

      return ts;
    },
  },

  psKill: {
    enumerable: true,
    value: (id) => {
      exec(`kill -15 ${id}`);
    },
  },
});
