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
        id = manager.exec(job);

        return res.status(200).json({
          resultCode: 201,
          result: {
            id,
            errorString: "",
          },
        });
      } catch (error) {
        logger.systemLogger.log.Error(
          `[STUDY_TRC] Job execution failed. (job: %s, error: %s)`,
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
    value: (job, req, res, next) => {
      try {
        checkCancelJob(job);
        manager.cancel(job);

        return res.status(200).json({ resultCode: 200, errorString: "" });
      } catch (error) {
        logger.systemLogger.log.Error(
          `[STUDY_TRC] Job cancellation failed. (transactionId: %s, error: %s)`,
          JSON.stringify(job.transactionId),
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
    value: (req, res, next) => {
      try {
        res.sendStatus(200);
        logger.systemLogger.log.Info(`[STUDY_TRC] get status success.`, 200);
      } catch (error) {
        res.sendStatus(500);
        logger.systemLogger.log.Error(
          `[STUDY_TRC] get status failed. (error: %s)`,
          error
        );
      }
    },
  },
});

function createJob(obj) {
  let job = new Job();
  job.id = obj.transactionId;
  job.serviceType = obj.serviceType
    ? obj.serviceType
    : workerMapper.SERVICE_TYPE.FFMPEG_TRC_1;

  if (
    job.serviceType === SERVICE_TYPE.FFMPEG_TRC_2 &&
    !Array.isArray(obj.outputs)
  ) {
    return createAtrcJob(job, obj);
  }
  job.data = obj;
  return job;
}

function createAtrcJob(job, obj) {
  obj.outputs.typeInfo = obj.basic.outputFilename;
  const data = {
    outputs: [obj.outputs],
    input: {
      typeInfo: `/home/shlee/mnt/input/${obj.basic.inputFilename}`,
      inputType: "FILE",
    },
    transactionId: job.id,
    serviceType: job.serviceType,
  };

  job.data = data;
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

function checkCancelJob(job) {
  let queue;
  switch (job.serviceType) {
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

  if (queue.find((j) => j.id === job.id) === undefined) {
    throw new Error("This ID is not found");
  }
}
