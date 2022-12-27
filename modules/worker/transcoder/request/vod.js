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
      console.log(trcStatus);
      try {
        systemLogger.systemInfo(
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
        systemLogger.systemInfo(
          `Sending transcode job status succeeded (status: %s, resultCode: %s, errorString: %s)`,
          JSON.stringify(status),
          JSON.stringify(resultCode),
          JSON.stringify(errorString)
        );
      } catch (error) {
        systemLogger.systemError(
          `Failed to send transcode job status. (trcStatus: %s, error: %s)`,
          JSON.stringify(trcStatus),
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      }
    },
  },
});
