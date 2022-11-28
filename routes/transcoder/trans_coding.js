const express = require("express"),
  router = express.Router(),
  controller = require("../../controller");

router.post(
  "/spawn",
  controller.validation.transcoder.modules.spawn,
  controller.controller.transcoder.modules.spawn
);

router.post(
  "/execJob",
  controller.validation.transcoder.modules.execJob,
  controller.controller.transcoder.modules.execJob
);

module.exports = router;
