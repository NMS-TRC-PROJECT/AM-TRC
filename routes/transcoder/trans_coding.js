const express = require("express"),
  router = express.Router(),
  controller = require("../../controller");

router.post(
  "/spawn",
  controller.validation.transcoder.encoding.spawn,
  controller.controller.transcoder.encoding.spawn
);

router.post(
  "/logger",
  controller.validation.transcoder.encoding.logger,
  controller.controller.transcoder.encoding.logger
);

module.exports = router;
