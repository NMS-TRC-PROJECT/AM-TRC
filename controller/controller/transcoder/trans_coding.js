const modules = require("../../../modules/request");

require("dotenv").config();

Object.defineProperties(exports, {
  spawn: {
    enumerable: true,
    value: (req, res) => {
      const { command } = res.locals;
      modules.request.transcoder.spawn(command);

      return res.status(201).json({ resultCode: 201, errorString: "" });
    },
  },

  logger: {
    enumerable: true,
    value: (req, res) => {
      modules.request.transcoder.logger();

      return res.status(201).json({ resultCode: 201, errorString: "" });
    },
  },
});
