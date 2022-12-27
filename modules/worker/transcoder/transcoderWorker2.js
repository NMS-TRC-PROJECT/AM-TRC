const schedule = require("node-schedule"),
  transcoder = require("../../transcoder"),
  manager = require("../../manager"),
  atrc = require("@amuzlab/atrc");

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
      _trcStatus: {
        writable: true,
        value: {},
      },
      _trcLogger: {
        writable: true,
        value: null,
      },
    });
  }

  get job() {
    return super.job;
  }

  set job(job) {
    /*   try {
      const ffmpegLoggers = Object.entries(Choicer).find(
        (e) => e[1] === true
      )[0];

      if (ffmpegLoggers === "ffmpegLogger")
        (Choicer.ffmpegLogger = false), (this._trcLogger = ffmpegLogger);
      else (Choicer.ffmpegLogger2 = false), (this._trcLogger = ffmpegLogger2);

      job.data.logger = ffmpegLoggers;

      super.job = job;
    } catch (error) {
      this.emit("error", error, this.job);
    } */
    super.job = job;
  }
  // 리팩토링 필요

  stop() {
    console.log("end");
  }

  exec() {
    super.exec();
    try {
      initATRC.call(this);
      this._atrc
        .exec(this.job)
        .then((result) => {
          console.log("result =>", result);
        })
        .catch((error) => {
          console.log(error);
        });

      // this.execTRC(); 레거시
    } catch (error) {
      this._trcScheduler.cancel();
      this.job.data.logger === "ffmpegLogger"
        ? (Choicer.ffmpegLogger = true)
        : (Choicer.ffmpegLogger2 = true);

      this._trcStatus.status = -1;
      console.log(this._trcStatus); // post 요청

      this.emit("error", error, this.job);
      manager.cancel(this.job.id);
    }
  }

  async totalFrame() {
    return (
      Math.round(
        await transcoder.TRC.getFileDuration(
          `${this.job.data.basic.inputFolder}/${this.job.data.basic.inputFilename}`
        )
      ) *
      (this.job.data.outputs.video.framerate
        ? this.job.data.outputs.video.framerate
        : 30)
    );
  }

  // setTrcStatus 간소화 필요
}

function initATRC() {
  atrc.config = {
    env: { LD_LIBRARY_PATH: process.env.ENV },
    // command: process.env.ATRC_PATH,
    // lib: process.env.ATRC_LIB,
    // packager: ,
  };

  this._atrc = atrc
    .getATRC({
      tempPath: `${ROOT_PATH}/mnt/output`,
      isProgress: true,
      progressInterval: 0.5,
      progressCheckInterval: 1,
      checkIncremetProgressTimeCnt: 3,
      retryCnt: 0,
      transcoder: {
        stopSignal: 255,
        successCode: 0,
        pidPath: `${ROOT_PATH}/mnt/pid`,
        // cwd: "/",
        // env: {},
      },
    })
    .on("transcoder.trc.start", (job, atrc) => console.log("start =>", job))
    .on("transcoder.trc.end", (job, atrc) => console.log("end", job))
    .on("error", (err, job, atrc) => console.error("error =>", err))
    .on("progress", (progress, job, atrc) =>
      console.log("progress =>", JSON.stringify(progress, null, "\t"))
    )
    .on("mediaMetaError", (err, job, atrc) =>
      console.log("mediaMetaError ", err)
    )
    .on("transcoder.trc.command", (command, atrc) =>
      console.log("transcoder.trc.command =>", command)
    )
    .on("transcoder.trc.error", (err, job, atrc) =>
      console.error("transcoder.trc.error", err)
    )
    .on("end", (job, atrc) => {
      console.log(job, 1);
    });
  // .on("transcoder.trc.stderr", (stderr, job, atrc) => {
  //   console.log(stderr);
  // });

  // const command = transcoder.commandBuilder.command.encoding(this.job.data);
  // systemLogger.systemDebug("ffmpeg_command", command.join(" "));
  // this.checkFile() 기능 개발 예정

  // this.job.data.childPsId = this._atrc.pid;
  // this._trcScheduler;
  // this._trcStatus.totalFrame = await this.totalFrame();
}

module.exports = transcoderWorker2;

/*  execTRC() {
    this._atrc.stderr.on("data", (data) => {
      this.updateTrcStatus(data);
      this._trcLogger.ffmpegInfo("stderr", data);
    });
    // 상태업데이트 분리시켜보기

    this._atrc.on("close", (code) => {
      this.job.data.logger === "ffmpegLogger"
        ? (Choicer.ffmpegLogger = true)
        : (Choicer.ffmpegLogger2 = true);
      this._trcLogger.ffmpegDebug("child process exited with code", code);
      this._trcScheduler.cancel();

      if (code === 0) {
        this._trcStatus.status = 0;
        this._trcStatus.percentage = `${100}%`;
        console.log(this._trcStatus); // post 요청
        this.emit("end", this.job, this);
      } else if (code === 255) {
        this._trcStatus.status = 3;
        console.log(this._trcStatus); // post 요청
        this.emit("end", this.job);
      } else {
        this._trcStatus.status = -1;
        console.log(this._trcStatus); // post 요청
        this.emit("error", `error code ${code}`, this.job);
        manager.cancel(this.job.id);
      }
    });
  } 레거시 */
