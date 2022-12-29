Object.defineProperties(exports, {
  STATUS: {
    enumerable: true,
    value: Object.freeze({
      ERROR: -1,
      DONE: 0,
      WAITING: 1,
      RUNNING: 2,
      CANCEL: 3,
      STOP: 4,
    }),
  },
  PROCESS: {
    enumerable: true,
    value: Object.freeze({
      ANALYZING: 1,
      TRANSCODING: 2,
      PACKAGING: 3,
      DISTRIBUTING: 4,
    }),
  },
});
