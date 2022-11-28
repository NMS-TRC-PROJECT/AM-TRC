const worker = require("@amuzlab/worker"),
  workerMapper = require("./WorkerMapper");

class Manager extends require("events") {
  constructor() {
    super();
    Object.defineProperties(this, {
      ffmpegContainer1: {
        enumerable: true,
        value: new worker.WorkerContainer({
          maxWorkerCount: 2,
        })
          .on("workerExec", (job, worker, workerContainer) => {})
          .on("workerEnd", (job, worker, workerContainer) => {})
          .on("workerStop", (job, worker, workerContainer) => {})
          .on("workerError", (error, job, worker, workerContainer) => {})
          .on("execError", (error, job, workerContainer) => {}),
      },
    });
  }

  checkExistenceJob(id) {
    const queue = [];
  }

  exec(job) {
    let result;

    result = this.ffmpegContainer1.exec(job);
    return result;
  }
}

module.exports = new Manager();
