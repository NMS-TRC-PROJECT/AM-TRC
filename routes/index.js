const express = require("express"),
  router = express.Router();

router.use("/transcoder", require("./transcoder"));

module.exports = router;
