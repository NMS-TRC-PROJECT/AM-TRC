const worker = require("@amuzlab/worker"),
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

const _map = new Map();
_map.set(
  "ffmpegTRC_1",
  "/home/shlee/Node_server/modules/worker/transcoder/transcoderWorker1.js"
);
_map.set(
  "ffmpegTRC_2",
  "/home/shlee/Node_server/modules/worker/transcoder/transcoderWorker1.js"
);

worker.map = _map;

Object.defineProperties(exports, {
  SERVICE_TYPE: {
    enumerable: true,
    value: SERVICE_TYPE,
  },
});
