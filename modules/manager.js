const worker = require("@amuzlab/worker");

class Manager extends require("events") {
  constructor() {
    super();
    Object.defineProperties(this, {
      ffmpegContainer1: {
        enumerable: true,
        value: new worker.WorkerContainer({
          maxWorkerCount: 2,
        })
          .on("workerExec", (job, worker, workerContainer) => {
            console.log(job);
          })
          .on("workerEnd", (job, worker, workerContainer) => {})
          .on("workerStop", (job, worker, workerContainer) => {})
          .on("workerError", (error, job, worker, workerContainer) => {
            console.log(error, job, worker, workerContainer, "workerError");
          })
          .on("execError", (error, job, workerContainer) => {
            console.log(error, job, worker, workerContainer, "execError");
          }),
      },
    });
  }

  checkExistenceJob(id) {
    const queue = [];
  }

  exec(job) {
    let result;
    // this.ffmpegContainer1.execWorker(job, this.ffmpegContainer1); 맞는건지 모르겠음

    result = this.ffmpegContainer1.exec(job);

    return result;
  }
}

module.exports = new Manager();
