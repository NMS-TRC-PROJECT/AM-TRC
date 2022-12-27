const { spawn } = require("child_process");
const { exec } = require("child_process");

require("dotenv").config();
const ffmpeg = process.env.FFMPEG;
const ffprobe = process.env.FFPROBE;
const ROOT_PATH = process.env.OFFICE_PWD_PATH;

// const ffmpeg = process.env.FFMPEG_LOCAL;
// const ffprobe = process.env.FFPROBE_LOCAL;
// const ROOT_PATH = process.env.LOCAL_PWD_PATH;

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
      return new Promise((resolve, reject) => {
        exec(`kill -15 ${psId}`).on("close", (code) => {
          resolve(code);
        });
      });
    },
  },

  getFileDuration: {
    enumerable: true,
    value: (file) => {
      return new Promise((resolve, reject) => {
        exec(
          `${ffprobe} -i ${ROOT_PATH}${file} -v quiet -show_entries format=duration -hide_banner -of default=noprint_wrappers=1:nokey=1`
        ).stdout.on("data", (data) => {
          resolve(data);
        });
      });
    },
  },
});
