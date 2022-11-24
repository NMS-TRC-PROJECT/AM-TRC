const modules = require("../../../modules/request");
const worker = require("@amuzlab/worker");
const { Job, Worker, WorkerContainer, error, map } = worker;

require("dotenv").config();

Object.defineProperties(exports, {
  spawn: {
    enumerable: true,
    value: (req, res) => {
      const { command } = res.locals;
      modules.request.transcoder.spawn(command);

      return res.status(201).json({ resultCode: 201, errorString: "" });
    },
  },

  worker: {
    enumerable: true,
    value: (req, res) => {
      const workerContainer = new WorkerContainer().on(
        "workerExec",
        (job, worker, workerContainer) => {}
      );

      return res.status(201).json({ resultCode: 201, errorString: "" });
    },
  },
});
