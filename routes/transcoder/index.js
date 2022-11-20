const express = require("express"),
  router = express.Router();

router.use("/encoding", require("./trans_coding"));

module.exports = router;
