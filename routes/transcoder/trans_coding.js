const express = require("express"),
  router = express.Router(),
  controller = require("../../controller");

router.post(
  "/spawn",
  controller.validation.transcoder.encoding.spawn,
  controller.controller.transcoder.encoding.spawn
);

module.exports = router;
