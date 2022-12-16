const works = require("@amuzlab/worker"),
  { Job, Worker, WorkerContainer, error, map } = works,
  workerMapper = require("../../../modules/WorkerMapper"),
  manager = require("../../../modules/manager");

const logger = require("../../../modules/logger");

require("dotenv").config();

Object.defineProperties(exports, {
  execJob: {
    enumerable: true,
    value: (body, req, res, next) => {
      let job;
      let id;
      try {
        job = createJob(body);
        checkExecJob(job.id, job.serviceType);
        manager.updateTrcStatus(job);
        id = manager.exec(job);

        return res.status(200).json({
          resultCode: 201,
          result: {
            id,
            errorString: "",
          },
        });
      } catch (error) {
        logger.systemLogger.log.systemError(
          `[FFMPEG_TRC] Job execution failed. (job: %s, error: %s)`,
          JSON.stringify(job),
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );

        return res
          .status(200)
          .json({ resultCode: 400, errorString: error.message });
      }
    },
  },

  cancelJob: {
    enumerable: true,
    value: (transactionId, req, res, next) => {
      try {
        checkCancelJob(transactionId);
        manager.psKill(transactionId);

        return res.status(200).json({ resultCode: 200, errorString: "" });
      } catch (error) {
        logger.systemLogger.log.systemError(
          `[FFMPEG_TRC] Job cancellation failed. (transactionId: %s, error: %s)`,
          JSON.stringify(transactionId),
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
        return res
          .status(200)
          .json({ resultCode: 400, errorString: error.message });
      }
    },
  },

  getStatus: {
    enumerable: true,
    value: async (req, res, next) => {
      try {
        res.sendStatus(200);
        logger.systemLogger.log.systemInfo(
          `[FFMPEG-TRC] get status success.`,
          200
        );
      } catch (error) {
        res.sendStatus(500);
        logger.systemLogger.log.systemError(
          `[FFMPEG-TRC] get status failed. (error: %s)`,
          error
        );
      }
    },
  },
});

function createJob(obj) {
  let job = new Job();
  job.id = obj.transactionId;
  job.data = obj;
  job.serviceType = obj.serviceType
    ? obj.serviceType
    : workerMapper.SERVICE_TYPE.FFMPEG_TRC_1;

  return job;
}

function checkExecJob(id, serviceType) {
  let queue;
  switch (serviceType) {
    case workerMapper.SERVICE_TYPE.FFMPEG_TRC_2:
      queue = [
        ...manager.ffmpegContainer2.readyQueue,
        ...manager.ffmpegContainer2.execQueue,
      ];
      break;
    default:
      queue = [
        ...manager.ffmpegContainer.readyQueue,
        ...manager.ffmpegContainer.execQueue,
      ];
  }
  if (queue.some((j) => j.id === id)) {
    throw new Error("This ID is already in use.");
  }
}

function checkCancelJob(id) {
  // 나중에 서비스 타입에 맞춰서 돌아가게 수정하기
  let queue = [...manager.ffmpegContainer.execQueue];
  if (queue.find((j) => j.id === id) === undefined) {
    throw new Error("This ID is not found");
  }
}
