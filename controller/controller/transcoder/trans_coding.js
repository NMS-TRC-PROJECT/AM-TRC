const modules = require("../../../modules/request");

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

  logger: {
    enumerable: true,
    value: (req, res) => {
      return res.status(201).json({ resultCode: 201, errorString: "" });
    },
  },

  worker: {
    enumerable: true,
    value: (req, res) => {
      /*  const worker = require("@amuzlab/worker");
      const { Job, Worker, WorkerContainer, error, map } = worker;

      const _map = new Map();
      _map.set("service-type1", "/path/to/some/worker1.js");
      _map.set("service-type2", "/path/to/some/worker2.js");
      _map.set("service-type3", "/path/to/some/worker3.js");

      worker.map = _map;

      const workerContainer = new WorkerContainer({
        maxWorkerCount: 1,
        autoGenerateJobId: false,
      })
        .on("workerExec", (job, worker, workerContainer) => {})
        .on("workerEnd", (job, worker, workerContainer) => {})
        .on("workerStop", (job, worker, workerContainer) => {})
        .on("workerError", (err, job, worker, workerContainer) => {})
        .on("execError", (err, job, workerContainer) => {});

      let id = 0;
      utils.forEach(_map, (_, key) => {
        // const job = {id: id++, serviceType: key} or
        const job = new Job();
        job.id = id++;
        job.serviceType = key;
        workerContainer.exec(job);
      });

      workerContainer.cancel(2);
      workerContainer.cancel((job) => job.id === 0 || job.id === 1);
      workerContainer.cancel(Symbol.for("amuzlab.worker.cancel.READY"));
      workerContainer.cancel(Symbol.for("amuzlab.worker.cancel.ALL")); */
    },
  },
});
