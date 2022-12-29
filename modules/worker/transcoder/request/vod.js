require("dotenv").config();

const request = require("@amuzlab/request"),
  logger = require("../../../logger"),
  systemLogger = logger.systemLogger.log,
  baseUrl = process.env.BASE_URL;

request.config.setDefault({
  retryCnt: 0,
  timeout: 3,
  // retryInterval: 1000,
});

Object.defineProperties(exports, {
  sendTranscodeJobStatus: {
    enumerable: true,
    value: async (trcStatus) => {
      try {
        systemLogger.Info(
          `Sending transcode job status. (data: %s)`,
          JSON.stringify(trcStatus)
        );
        const {
          status,
          data: { errorString, resultCode },
        } = await request.request(
          request.METHOD.PUT,
          `${baseUrl}/trc/vod/status`,
          trcStatus
        );
        systemLogger.Info(
          `Sending transcode job status succeeded (status: %s, resultCode: %s, errorString: %s)`,
          JSON.stringify(status),
          JSON.stringify(resultCode),
          JSON.stringify(errorString)
        );
      } catch (error) {
        systemLogger.Error(
          `Failed to send transcode job status. (trcStatus: %s, error: %s)`,
          JSON.stringify(trcStatus),
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }
    },
  }, // child spawn 용 레거시 코드

  sendTranscodeJobStatusATRC: {
    enumerable: true,
    value: async (job, error) => {
      const data = {
        frames: job.progress && job.progress.frame ? job.progress.frame : 0,
        speed: job.progress && job.progress.speed ? job.progress.speed : 0,
        percentage:
          job.progress && job.progress.percentage ? job.progress.percentage : 0,
        status: job.status,
        transactionId: job.id,
        errorString: error ? error.message : "",
        errorCode: error && error.errorCode ? error.errorCode : "",
      };
      try {
        systemLogger.Info(
          `Sending transcode job status. (data: %s)`,
          JSON.stringify(data)
        );
        const {
          status,
          data: { errorString, resultCode },
        } = await request.request(
          request.METHOD.PUT,
          `${baseUrl}/trc/vod/status`,
          data
        );
        systemLogger.Info(
          `Sending transcode job status succeeded (status: %s, resultCode: %s, errorString: %s)`,
          JSON.stringify(status),
          JSON.stringify(resultCode),
          JSON.stringify(errorString)
        );
      } catch (error) {
        systemLogger.Error(
          `Failed to send transcode job status. (error: %s)`,
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }
    },
  }, // ATRC 모델용
});
