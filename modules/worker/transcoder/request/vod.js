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
        systemLogger.systemInfo(
          `Sending transcode job status. (data: %s)`,
          JSON.stringify(trcStatus)
        );
        const {
          status,
          data: { resultCode },
        } = await request.request(
          request.METHOD.PUT,
          `${baseUrl}/trc/vod/status`,
          trcStatus
        );
        systemLogger.systemInfo(
          `Sending transcode job status succeeded (status: %s, resultCode: %s)`,
          JSON.stringify(status),
          JSON.stringify(resultCode)
        );
      } catch (error) {
        systemLogger.systemError(
          `Failed to send transcode job status. (trcStatus: %s, error: %s)`,
          JSON.stringify(trcStatus),
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
        // 혼자 요청 보낼 떄 에러나는데 왜 나는지 모르겠음... ㅠㅠ
      }
    },
  },
});
