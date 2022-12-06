const transcoder = require("../../../modules/transcoder");
const manager = require("../../../modules/manager");
const logger = require("../../../modules/logger");

Object.defineProperties(exports, {
  spawn: {
    enumerable: true,
    value: (req, res, next) => {},
  },

  execJob: {
    enumerable: true,
    value: (req, res, next) => {
      let { body } = req;

      const { input, width, height, video_c, audio_c, Kbps_v, output } =
        body.spec;

      transcoder.commandBuilder.command.validation(
        input,
        width,
        height,
        video_c,
        audio_c,
        Kbps_v,
        output
      );

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

  getStatus: {
    enumerable: true,
    value: async (req, res, next) => {
      next();
    },
  },
});
