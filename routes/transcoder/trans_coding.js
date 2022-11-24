const express = require("express"),
  router = express.Router(),
  controller = require("../../controller");

router.post(
  "/spawn",
  controller.validation.transcoder.modules.spawn,
  controller.controller.transcoder.modules.spawn
);

router.post(
  "/worker",
  controller.validation.transcoder.modules.worker,
  controller.controller.transcoder.modules.worker
);

module.exports = router;
