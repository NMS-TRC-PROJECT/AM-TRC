require("dotenv").config();

const path = require("path"),
  ROOT_PATH = path.join(__dirname, "..", "..", "..");

Object.defineProperties(exports, {
  encoding: {
    enumerable: true,
    value: (spec) => {
      const { input, width, height, video_c, audio_c, Kbps_v, output } = spec;
      let resolution = `${width}*${height}`;

      let command = ["-y", "-i", `${ROOT_PATH}/${input}`];
      if (resolution) command.push("-s", `${resolution}`);
      if (video_c) command.push("-c:v", `${video_c}`);
      if (audio_c) command.push("-c:a", `${audio_c}`);
      if (Kbps_v) command.push("-b:v", `${Kbps_v}k`);
      command.push(`${ROOT_PATH}/${output}`);
      return command;
    },
  },

  validation: {
    enumerable: true,
    value: (input, width, height, video_c, audio_c, Kbps_v, output) => {
      const err_msg = [];

      if (!input) err_msg.push("check source file");

      if (width || height) {
        if (typeof width !== "number" || typeof height !== "number") {
          err_msg.push("check resolution");
        }
      }

      if (video_c && typeof video_c !== "string") err_msg.push("check c:v");
      if (video_c && typeof audio_c !== "string") err_msg.push("check c:a");

      if (typeof Kbps_v !== "number") err_msg.push("check b");

      if (!output) err_msg.push("check out file");

      if (err_msg.length !== 0) {
        const error = new Error(
          `ffmpeg command error : ${err_msg.join(" and ")}`
        );
        error.status = 400;

        next(error);
      }
    },
  },
});
