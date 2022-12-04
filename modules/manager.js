const worker = require("@amuzlab/worker"),
  workerMapper = require("./WorkerMapper"),
  logger = require("../modules/logger"),
  trc = require("./transcoder/trans_coding");

class Manager extends require("events") {
  constructor() {
    super();
    Object.defineProperties(this, {
      ffmpegContainer: {
        enumerable: true,
        value: new worker.WorkerContainer({
          maxWorkerCount: 2,
        })
          .on("workerExec", (job, worker, workerContainer) => {
            logger.systemLogger.log.systemDebug(
              "[workerContainer] workerExec (job.id: %s, job.serviceType: %s)",
              `${JSON.stringify(job.id)}`,
              `${JSON.stringify(job.serviceType)}`
            );
          })
          .on("workerEnd", (job, worker, workerContainer) => {
            logger.systemLogger.log.systemDebug(
              "[workerContainer] workerEnd (job.id: %s, job.serviceType: %s)",
              `${JSON.stringify(job.id)}`,
              `${JSON.stringify(job.serviceType)}`
            );
          })
          .on("workerStop", (job, worker, workerContainer) => {
            logger.systemLogger.log.systemDebug(
              "[workerContainer] workerStop (job.id: %s, job.serviceType: %s)",
              `${JSON.stringify(job.id)}`,
              `${JSON.stringify(job.serviceType)}`
            );
          })
          .on("workerError", (error, job, worker, workerContainer) => {
            if (error) {
              logger.systemLogger.log.systemError(
                "[workerContainer] workerError (job: %s, error : %s)",
                `${JSON.stringify(job)}`,
                `${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
              );
            }
          })
          .on("execError", (error, job, workerContainer) => {
            if (error) {
              logger.systemLogger.log.systemError(
                "[workerContainer] execError (job: %s, error : %s)",
                `${JSON.stringify(job)}`,
                `${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
              );
            }
          }),
      },

      ffmpegContainer2: {
        enumerable: true,
        value: new worker.WorkerContainer({
          maxWorkerCount: 2,
        })
          .on("workerExec", (job, worker, workerContainer) => {
            logger.systemLogger.log.systemDebug(
              "[workerContainer] workerExec (job.id: %s)",
              `${JSON.stringify(job.id)}`
            );
          })
          .on("workerEnd", (job, worker, workerContainer) => {
            logger.systemLogger.log.systemDebug(
              "[workerContainer] workerEnd (job.id: %s)",
              `${JSON.stringify(job.id)}`
            );
          })
          .on("workerStop", (job, worker, workerContainer) => {
            logger.systemLogger.log.systemDebug(
              "[workerContainer] workerStop (job.id: %s)",
              `${JSON.stringify(job.id)}`
            );
          })
          .on("workerError", (error, job, worker, workerContainer) => {
            if (error) {
              logger.systemLogger.log.systemError(
                "[workerContainer] workerError (job: %s, error : %s)",
                `${JSON.stringify(job)}`,
                `${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
              );
            }
          })
          .on("execError", (error, job, workerContainer) => {
            if (error) {
              logger.systemLogger.log.systemError(
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

    switch (job.serviceType) {
      case workerMapper.SERVICE_TYPE.FFMPEG_TRC_2:
        result = this.ffmpegContainer2.exec(job);
        break;
      default:
        result = this.ffmpegContainer.exec(job);
    }
    return result;
  }

  cancel(id) {
    let result;
    let psId = this.ffmpegContainer.execQueue.find((j) => j.id === id).data
      .childPsId;

    trc.psKill(psId); // 제대로 프로세스 멈췄는지 확인하기

    setTimeout(() => {
      result = this.ffmpegContainer.cancel(id);
      console.log("qwe");
    }, 1000);

    return result;

    // worker에서 이벤트 내용에 맞게 cancel 처리 시키기
    // 서비스 타입에 맞춰서 cancel하는 기능 추가하기
  }

  get workerContainer() {
    return this.ffmpegContainer;
  }
}

module.exports = new Manager();
