require("dotenv").config();

const worker = require("@amuzlab/worker"),
  path = require("path");

ROOT_PATH = path.join(__dirname, "..");

SERVICE_TYPE = Object.create(null, {
  FFMPEG_TRC_1: {
    enumerable: true,
    value: "ffmpegTRC_1",
  },
  FFMPEG_TRC_2: {
    enumerable: true,
    value: "ffmpegTRC_2",
  },
});

MAPPER = {};

MAPPER[SERVICE_TYPE.FFMPEG_TRC_1] = path.join(
  ROOT_PATH,
  "modules",
  "worker",
  "transcoder",
  "transcoderWorker1.js"
);
//   "/home/shlee/Node_server/modules/worker/transcoder/transcoderWorker1.js";
MAPPER[SERVICE_TYPE.FFMPEG_TRC_2] = path.join(
  ROOT_PATH,
  "modules",
  "worker",
  "transcoder",
  "transcoderWorker2.js"
);
//   "/home/shlee/Node_server/modules/worker/transcoder/transcoderWorker2.js";

worker.map = MAPPER;

Object.defineProperties(exports, {
  SERVICE_TYPE: {
    enumerable: true,
    value: SERVICE_TYPE,
  },
});
