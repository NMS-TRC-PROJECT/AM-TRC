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
      _trcScheduler: {
        writable: true,
        value: schedule.scheduleJob("0/5 * * * * *", () => {
          console.log(this._trcStatus);
        }),
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
    try {
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
    }
  }
  // 리팩토링 필요

  exec() {
    super.exec();
    try {
      initATRC.call(this);
      this.execTRC();
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

  execTRC() {
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

  updateTrcStatus(data) {
    let frame = String(data).match(/^frame/)?.[0], // stderr에서 log 정보가 있는 경우를 찾기 위해 사용
      trcInfo = String(data).match(/(\d*\.?\d+)/g),
      dup = String(data).match(/dup/)?.[0],
      drop = String(data).match(/drop/)?.[0];

    if (frame) {
      this._trcStatus.frame = trcInfo[0];
      this._trcStatus.bitrate = `${trcInfo[7]}kbits/s`;
      if (dup && drop) {
        this._trcStatus.speed = `${trcInfo[10] ? trcInfo[10] : trcInfo[9]}x`;
      } else {
        this._trcStatus.speed = `${trcInfo[8]}x`;
      }
      this._trcStatus.status = 2;
      this._trcStatus.percentage = `${(
        (trcInfo[0] / this._trcStatus.totalFrame) *
        100
      ).toFixed(2)}%`;
    }
  }

  // setTrcStatus 간소화 필요
}

function initATRC() {
  atrc.config = { command: process.env.ATRC_PATH };

  this._atrc = atrc.getATRC({
    transcoder: {
      stopSignal: 255,
      successCode: 0,
      pidPath: `${ROOT_PATH}/mnt/pid`,
    },
  });

  // const command = transcoder.commandBuilder.command.encoding(this.job.data);
  // systemLogger.systemDebug("ffmpeg_command", command.join(" "));
  // this.checkFile() 기능 개발 예정

  // this.job.data.childPsId = this._atrc.pid;
  // this._trcScheduler;
  // this._trcStatus.totalFrame = await this.totalFrame();
}

module.exports = transcoderWorker2;
