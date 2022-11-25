const req_modules = require("../../../modules/request");
const works = require("@amuzlab/worker"),
  { Job, Worker, WorkerContainer, error, map } = works,
  manager = require("../../../modules/manager");

require("dotenv").config();

Object.defineProperties(exports, {
  spawn: {
    enumerable: true,
    value: (req, res) => {
      const { command } = res.locals;
      req_modules.request.transcoder.spawn(command);

      return res.status(201).json({ resultCode: 201, errorString: "" });
    },
  },

  worker: {
    enumerable: true,
    value: (body, req, res, next) => {
      let job = createJob(body);

      const result = manager.exec(job);
      console.log(result);

      return res.status(200).json({ resultCode: 200, errorString: "" });
    },
  },
});

function createJob(obj) {
  let job = new Job();
  job.id = obj.transactionId;
  job.data = obj;
  job.serviceType = obj.serviceType;

  return job;
}
