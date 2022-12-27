const Logger = require("@amuzlab/logger"),
  systemLogger = new Logger.Logger({
    level: "debug",
    transport: "file",
    logDir: "~/log",
    logFileName: "system_log",
  });

// logger 인자값 인피니티로 받을 수 있게 수정하기

Object.defineProperties(exports, {
  systemInfo: {
    enumerable: true,
    value: (message, data, data2, data3) => {
      systemLogger.info(
        `${message} %s`,
        `: ${data}`,
        data2 ? `: ${data2}` : "",
        data3 ? `: ${data3}` : ""
      );
    },
  },

  systemError: {
    enumerable: true,
    value: (message, data, data2) => {
      systemLogger.error(
        `${message} %s`,
        `: ${data}`,
        data2 ? `: ${data2}` : ""
      );
    },
  },
  systemWarn: {
    enumerable: true,
    value: (message, data, data2) => {
      systemLogger.warn(`${message} %s`, `: ${data}`);
    },
  },
  systemDebug: {
    enumerable: true,
    value: (message, data, data2) => {
      systemLogger.debug(
        `${message} %s`,
        `: ${data}`,
        data2 ? `: ${data2}` : ""
      );
    },
  },
});
