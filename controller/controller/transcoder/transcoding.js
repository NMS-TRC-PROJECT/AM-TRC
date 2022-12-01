const transcoder = require("../../../modules/transcoder");
const works = require("@amuzlab/worker"),
  { Job, Worker, WorkerContainer, error, map } = works,
  workerMapper = require("../../../modules/WorkerMapper"),
  manager = require("../../../modules/manager");

const logger = require("../../../modules/logger");

require("dotenv").config();

Object.defineProperties(exports, {
  spawn: {
    enumerable: true,
    value: (req, res) => {
      const { command } = res.locals;
      transcoder.TRC.spawn(command);

      return res.status(201).json({ resultCode: 201, errorString: "" });
    },
  },

  execJob: {
    enumerable: true,
    value: (body, req, res, next) => {
      let job;
      try {
        job = createJob(body);
        checkExistenceJob(job.id, job.serviceType);
        manager.exec(job);

        logger.systemLogger.log.systemInfo(
          `[FFMPEG_TRC] Job execution success. (job.id: %s, job.serviceType: %s)`,
          `${JSON.stringify(job.id)}`,
          `${JSON.stringify(job.serviceType)}`
        );

        return res.status(200).json({ resultCode: 200, errorString: "" });
      } catch (error) {
        logger.systemLogger.log.systemError(
          `[FFMPEG_TRC] Job execution failed. (job: %s, error: %s)`,
          JSON.stringify(job),
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );

        return res.status(400).json({ resultCode: 400, errorString: "" });
      }
    },
  },

  cancelJob: {
    enumerable: true,
    value: (transactionId, req, res, next) => {
      try {
        const job = manager.cancel(Number(transactionId));
        logger.systemLogger.log.systemInfo(
          `[FFMPEG_TRC] Job cancellation success. (job.id: %s, job.serviceType: %s)`,
          `${JSON.stringify(job[0].data.id)}`,
          `${JSON.stringify(job[0].data.serviceType)}`
        );

        return res.status(200).json({ resultCode: 200, errorString: "" });
      } catch (error) {
        logger.systemLogger.log.systemError(
          `[FFMPEG_TRC] Job cancellation failed. (transactionId: %s, error: %s)`,
          JSON.stringify(transactionId),
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
        return res.status(400).json({ resultCode: 400, errorString: "" });
      }
    },
  },
});

function createJob(obj) {
  let job = new Job();
  job.id = obj.id;
  job.data = obj;
  job.serviceType = obj.serviceType;

  return job;
}

function checkExistenceJob(id, serviceType) {
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

  if (queue.some((j) => j.data.id === id)) {
    throw new Error("This ID is already in use.");
  }
}
