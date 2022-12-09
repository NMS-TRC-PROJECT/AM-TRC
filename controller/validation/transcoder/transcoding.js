const transcoder = require("../../../modules/transcoder");
const manager = require("../../../modules/manager");
const logger = require("../../../modules/logger");

Object.defineProperties(exports, {
  execJob: {
    enumerable: true,
    value: (req, res, next) => {
      try {
        let { body } = req;
        transcoder.commandBuilder.command.validation(body);

        next(body);
      } catch (error) {
        logger.systemLogger.log.systemError(
          `[FFMPEG_TRC] Invalid Preset (error: %s)`,
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
        return res
          .status(400)
          .json({ resultCode: 400, errorString: error.message });
      }
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
