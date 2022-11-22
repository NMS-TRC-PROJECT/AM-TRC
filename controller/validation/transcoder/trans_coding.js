const modules = require("../../../modules/request");

const Logger = require("@amuzlab/logger")({
  level: "debug",
  timestamp: true,
  timeFormat: "YYYY-MM-DD HH:mm:ss",
  transport: "file",
  logDir: "~/log",
  logFileName: "out",
  datePattern: "YYYY-MM-DD",
  maxSize: "50m",
  maxFiles: "10d",
});

Object.defineProperties(exports, {
  // 데이터 서술자 사용, value를 사용하면 데이터 서술자이다.
  // enumerable 속성은 해당 객체의 속성들의 열거 유무이며 default는 false이다.

  // 접근자 서술자는 getter, setter를 사용한다.

  spawn: {
    enumerable: true,
    value: (req, res, next) => {
      const { input, width, height, video_c, audio_c, Kbps_v, output } =
        req.body;
      const err_msg = [];
      let resolution = "";

      if (!input) err_msg.push("check source file");

      if (width || height) {
        if (typeof width !== "number" || typeof height !== "number") {
          err_msg.push("check resolution");
        } else {
          resolution = `${width}*${height}`;
        }
      }

      if (video_c && typeof video_c !== "string") err_msg.push("check c:v");
      if (video_c && typeof audio_c !== "string") err_msg.push("check c:a");

      if (typeof Kbps_v !== "number") err_msg.push("check b");

      if (!output) err_msg.push("check out file");

      if (err_msg.length === 0) {
        res.locals.command = modules.request.transcoder.encoding_command(
          input,
          resolution,
          video_c,
          audio_c,
          Kbps_v,
          output
        );
        next();
      } else {
        const error = new Error(err_msg.join(" and "));
        error.status = 400;
        Logger.error("log message %s %j", new Error(error));
        next(error);
      }
    },
  },

  logger: {
    enumerable: true,
    value: (req, res, next) => {
      next();
    },
  },
});
