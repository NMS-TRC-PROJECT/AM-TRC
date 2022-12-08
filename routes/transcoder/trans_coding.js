const express = require("express"),
  router = express.Router(),
  controller = require("../../controller");

router.get(
  "/status",
  controller.validation.transcoder.modules.getStatus,
  controller.controller.transcoder.modules.getStatus
);

router.post(
  "/execJob",
  controller.validation.transcoder.modules.execJob,
  controller.controller.transcoder.modules.execJob
);

router.delete(
  "/cancelJob/:transactionId",
  controller.validation.transcoder.modules.cancelJob,
  controller.controller.transcoder.modules.cancelJob
);

module.exports = router;
