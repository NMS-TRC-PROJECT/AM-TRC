const trc = require("../../../modules/request/transcoder/trans_coding");
const command = [
  "-y",
  "-i",
  "/home/shlee/out_4M.mp4",
  "-s",
  "300*300",
  "-c:v",
  "libx264",
  "-c:a",
  "aac",
  "-b:v",
  "100k",
  "/home/shlee/out_3.ts",
];

class transcoderWorker1 extends require("@amuzlab/worker").Worker {
  constructor() {
    super();
  }

  exec() {
    // trc.spawn(command);
  }

  stop() {
    console.log("stop");
  }
}

module.exports = transcoderWorker1;
