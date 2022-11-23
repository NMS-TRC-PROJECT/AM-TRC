const express = require("express"),
  router = express.Router();

router.use("/modules", require("./trans_coding"));

module.exports = router;
