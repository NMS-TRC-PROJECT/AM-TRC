const atrc = require("@amuzlab/atrc"),
  { RequestBalancer } = require("@amuzlab/request"),
  request = require("./request"),
  ENUM = require("./enum");

const logger = require("../../logger"),
  ffmpegLogger = logger.ffmpegLogger.log,
  ffmpegLogger2 = logger.ffmpegLogger.log2,
  systemLogger = logger.systemLogger.log,
  Choicer = logger.loggerChoicer,
  path = require("path"),
  ROOT_PATH = path.join(__dirname, "..", "..", "..", "..");

class transcoderWorker2 extends require("@amuzlab/worker").Worker {
  constructor() {
    super();
    Object.defineProperties(this, {
      _atrc: {
        writable: true,
        value: null,
      },
      _trcLogger: {
        writable: true,
        value: null,
      },
      _statusUpdateQueue: {
        writable: true,
        value: new RequestBalancer({
          errorHandler: (error) =>
            systemLogger.Error(
              `[%s] statusUpdateQueue error (error: %j)`,
              this.job.id,
              error
            ),
        }),
      },
    });
  }

  get job() {
    return super.job;
  }

  set job(job) {
    const ffmpegLoggers = Object.entries(Choicer).find((e) => e[1] === true)[0];
    if (ffmpegLoggers === "ffmpegLogger")
      (Choicer.ffmpegLogger = false), (this._trcLogger = ffmpegLogger);
    else (Choicer.ffmpegLogger2 = false), (this._trcLogger = ffmpegLogger2);
    job.data.logger = ffmpegLoggers;

    job.status = ENUM.JOB.STATUS.WAITING;
    super.job = job;
  }
  // 리팩토링 필요

  stop() {
    this._atrc
      .stop()
      .then(() => {
        this._statusUpdateQueue.clear();
        loggerBalance.call(this);
        sendTranscodeJobStatus.call(this, this.job, ENUM.JOB.STATUS.CANCEL);
        super.stop();
      })
      .catch((error) => {
        this._statusUpdateQueue.clear();
        loggerBalance.call(this);
        systemLogger.Info("worker stop error (error: %j)", error);
        sendTranscodeJobStatus.call(
          this,
          this.job,
          ENUM.JOB.STATUS.ERROR,
          null,
          error
        );
        this.emit("error", error, this.job, this);
      });
  }

  exec() {
    super.exec();
    try {
      initATRC.call(this);
      sendTranscodeJobStatus.call(this, this.job, ENUM.JOB.STATUS.WAITING);
      this._atrc
        .exec(this.job)
        .then((result) => {
          systemLogger.Debug(
            `worker exec result  (result: %s)`,
            result ? JSON.stringify(result) : undefined
          );
        })
        .catch((error) => {
          workerErrorHandler.call(this, error);
        });
    } catch (error) {
      workerErrorHandler.call(this, error);
    }
  }
}

function initATRC() {
  atrc.config = {
    env: { LD_LIBRARY_PATH: process.env.ENV },
    // packager:
  };

  this._atrc = atrc
    .getATRC({
      tempPath: `${ROOT_PATH}/mnt/output`,
      isProgress: true,
      progressInterval: 3,
      progressCheckInterval: 1,
      checkIncremetProgressTimeCnt: 3,
      retryCnt: 0,
      transcoder: {
        stopSignal: 255,
        successCode: 0,
        // pidPath: `${ROOT_PATH}/mnt/pid`,
      },
    })
    .on("end", (job, atrc) => {
      loggerBalance.call(this);
      sendTranscodeJobStatus.call(this, job, ENUM.JOB.STATUS.DONE);
      this.emit("end", this.job, this); // end emit에 this를 같이 보내지 않으면 worker가 멈추지 않음
    })
    .on("transcoder.trc.start", (job, atrc) =>
      systemLogger.Info("ATRC start (transactionId: %s)", job.id)
    )
    .on("transcoder.trc.command", (command, atrc) =>
      systemLogger.Debug(
        `transcoder.trc.command (command: %s, transactionId : %s)`,
        command,
        this.job.id
      )
    )
    .on("progress", (progress, job, atrc) => {
      job.progress = progress;
      sendTranscodeJobStatus.call(this, job, ENUM.JOB.STATUS.RUNNING);
    })
    .on("error", (err, job, atrc) => {
      workerErrorHandler.call(this, err);
    })
    // .on("transcoder.trc.error", (err, job, atrc) =>
    //   console.error("transcoder.trc.error", err)
    // )
    .on("transcoder.trc.stderr", (stderr) => {
      stderr
        .split("\n")
        .forEach((msg) => msg && this._trcLogger.Debug(`[STDERR] ${msg}`));
    });
}

async function sendTranscodeJobStatus(job, status, process, error) {
  const update = async () => {
    job.status = status;
    return await request.vod.sendTranscodeJobStatusATRC(job, error);
  };
  this._statusUpdateQueue.push(update);
}

function workerErrorHandler(error) {
  loggerBalance.call(this);
  sendTranscodeJobStatus.call(
    this,
    this.job,
    ENUM.JOB.STATUS.ERROR,
    null,
    error
  );
  this.emit("error", error, this.job);
  this._atrc &&
    this._atrc
      .stop()
      .then(() =>
        systemLogger.Debug(`worker stopped by error (error: %j)`, error)
      )
      .catch((error) =>
        systemLogger.Error(`worker stopped by error error (error: %j)`, error)
      );
}

function loggerBalance() {
  this.job.data.logger === "ffmpegLogger"
    ? (Choicer.ffmpegLogger = true)
    : (Choicer.ffmpegLogger2 = true);
}

module.exports = transcoderWorker2;
