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
          // autoGenerateJobId: true,
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
            logger.systemLogger.log.systemError(
              "[workerContainer] workerError (job: %s, error : %s)",
              `${JSON.stringify(job)}`,
              `${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
            );
          })
          .on("execError", (error, job, workerContainer) => {
            logger.systemLogger.log.systemError(
              "[workerContainer] execError (job: %s, error : %s)",
              `${JSON.stringify(job)}`,
              `${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
            );
          }),
      },

      ffmpegContainer2: {
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
            logger.systemLogger.log.systemError(
              "[workerContainer] workerError (job: %s, error : %s)",
              `${JSON.stringify(job)}`,
              `${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
            );
          })
          .on("execError", (error, job, workerContainer) => {
            logger.systemLogger.log.systemError(
              "[workerContainer] execError (job: %s, error : %s)",
              `${JSON.stringify(job)}`,
              `${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
            );
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

  async cancel(job) {
    let result;

    switch (job.serviceType) {
      case workerMapper.SERVICE_TYPE.FFMPEG_TRC_2:
        // await trc.psKill(
        //   this.ffmpegContainer2.execQueue.find(
        //     (j) => j.id === jobInfo.transactionId
        //   ).data.childPsId
        // );
        result = this.ffmpegContainer2.cancel(job.id);
        break;
      default:
        await trc
          .psKill(
            this.ffmpegContainer.execQueue.find((j) => j.id === job.id).data
              .childPsId
          )
          .then((code) => {
            code !== 0
              ? logger.systemLogger.log.systemError(
                  "[process] killError (code: %s) ",
                  `${code}`
                )
              : (result = this.ffmpegContainer.cancel(job.id));
          });
    }

    return result;
  }

  updateTrcStatus(job) {
    let status = {
      transactionId: job.id,
      status: 2,
      transcodes: [
        {
          presetCode: "",
          outputFilename: job.data.basic.outputFilename,
        },
      ],
    };

    // 포스트 요청 보내는 기능 만들기
  }

  get workerContainer() {
    return this.ffmpegContainer;
  }
}

module.exports = new Manager();
