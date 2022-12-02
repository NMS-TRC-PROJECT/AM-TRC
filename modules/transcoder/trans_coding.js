const { rejects } = require("assert");
const { constants } = require("buffer");
const { spawn } = require("child_process");
const { exec } = require("child_process");
const { resolve } = require("path");

require("dotenv").config();
const ffmpeg = process.env.FFMPEG_OFFICE;

// const ffmpeg = process.env.FFMPEG_LOCAL;

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
    value: (psId) => {
      return new Promise((resolve, rejects) => {
        exec(`kill -15 ${psId}`).on("close", (data) => {
          resolve(data);
        });
      });
    },
  },
});
