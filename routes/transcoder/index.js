const express = require("express"),
  router = express.Router();

router.use("/vod", require("./trans_coding"));

module.exports = router;
