const worker = require("@amuzlab/worker");
const systemLogger = require("../modules/logger/systemLogger");

require("./WorkerMapper");

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
            systemLogger.systemInfo(
              "[workerContainer] workerExec (job: %s, error : %s)",
              `${JSON.stringify(job)}`
            );
          })
          .on("workerEnd", (job, worker, workerContainer) => {
            systemLogger.systemInfo(
              "[workerContainer] workerEnd (job: %s, error : %s)",
              `${JSON.stringify(job)}`
            );
          })
          .on("workerStop", (job, worker, workerContainer) => {
            systemLogger.systemInfo(
              "[workerContainer] workerStop (job: %s, error : %s)",
              `${JSON.stringify(job)}`
            );
          })
          .on("workerError", (error, job, worker, workerContainer) => {
            if (error) {
              systemLogger.systemError(
                "[workerContainer] workerError (job: %s, error : %s)",
                `${JSON.stringify(job)}`,
                `${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
              );
            }
          })
          .on("execError", (error, job, workerContainer) => {
            if (error) {
              systemLogger.systemError(
                "[workerContainer] execError (job: %s, error : %s)",
                `${JSON.stringify(job)}`,
                `${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
              );
            }
          }),
      },
    });
  }

  exec(job) {
    let result;
    result = this.ffmpegContainer1.exec(job);

    return result;
  }

  cancel(id) {
    return this.ffmpegContainer1.cancel(id);
  }

  get workerContainer() {
    return this.ffmpegContainer1;
  }
}

module.exports = new Manager();
