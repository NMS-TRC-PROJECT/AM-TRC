const modules = require("../../../modules/request");
const logger = require("../../../modules/logger/ffmpeg_logger");

Object.defineProperties(exports, {
  spawn: {
    enumerable: true,
    value: (req, res, next) => {
      const { input, width, height, video_c, audio_c, Kbps_v, output } =
        req.body;
      const err_msg = [];
      let resolution = "";

      if (!input) err_msg.push("check source file");

      if (width || height) {
        if (typeof width !== "number" || typeof height !== "number") {
          err_msg.push("check resolution");
        } else {
          resolution = `${width}*${height}`;
        }
      }

      if (video_c && typeof video_c !== "string") err_msg.push("check c:v");
      if (video_c && typeof audio_c !== "string") err_msg.push("check c:a");

      if (typeof Kbps_v !== "number") err_msg.push("check b");

      if (!output) err_msg.push("check out file");

      const command = modules.request.transcoder.encoding_command(
        input,
        resolution,
        video_c,
        audio_c,
        Kbps_v,
        output
      );

      if (err_msg.length === 0) {
        res.locals.command = command;
        next();
      } else {
        const error = new Error(err_msg.join(" and "));
        error.status = 400;
        logger.ffmpeg_error(error.stack, `command : ${command.join(" ")}`);
        next(error);
      }
    },
  },

  logger: {
    enumerable: true,
    value: (req, res, next) => {
      next();
    },
  },
});
