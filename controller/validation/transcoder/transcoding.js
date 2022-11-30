const req_modules = require("../../../modules/request");
const manager = require("../../../modules/manager");

const ffmpegLogger = require("../../../modules/logger/ffmpegLogger");
const systemLogger = require("../../../modules/logger/systemLogger");

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

      const command = req_modules.request.transcoder.encoding_command(
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
        ffmpegLogger.ffmpegError(error.stack, `command : ${command.join(" ")}`);
        next(error);
      }
    },
  },

  execJob: {
    enumerable: true,
    value: (req, res, next) => {
      const { body } = req;
      next(body);
    },
  },

  cancelJob: {
    enumerable: true,
    value: (req, res, next) => {
      const { transactionId } = req.params;
      next(transactionId);
    },
  },
});
