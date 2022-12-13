const { spawn } = require("child_process");
const { exec } = require("child_process");

require("dotenv").config();
const ffmpeg = process.env.FFMPEG_OFFICE;
const ffprobe = process.env.FFPROBE_OFFICE;
const ROOT_PATH = process.env.OFFICE_PWD_PATH;

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
  getFileDuration: {
    enumerable: true,
    value: (file) => {
      let count = 0;
      return new Promise((resolve, reject) => {
        exec(`${ffprobe} -i ${ROOT_PATH}/${file}`).stderr.on("data", (data) => {
          if (String(data).match(/Duration/)) resolve(data);
          else if (count === 5) reject("No Such File"); // 아직 기능 미완성
          else count++;
        });
      });
    },
  },
});
