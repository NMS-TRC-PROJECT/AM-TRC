class transcoderWorker2 extends require("@amuzlab/worker").Worker {
  constructor() {
    super();
  }

  exec() {
    console.log("workerContainer2 test");
  }
}

module.exports = transcoderWorker2;
