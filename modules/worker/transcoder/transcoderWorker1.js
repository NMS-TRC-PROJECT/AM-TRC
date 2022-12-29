const schedule = require("node-schedule"),
  transcoder = require("../../transcoder"),
  manager = require("../../manager"),
  request = require("./request");

const logger = require("../../logger"),
  ffmpegLogger = logger.ffmpegLogger.log,
  ffmpegLogger2 = logger.ffmpegLogger.log2,
  systemLogger = logger.systemLogger.log,
  Choicer = logger.loggerChoicer;

class transcoderWorker1 extends require("@amuzlab/worker").Worker {
  constructor() {
    super();
    Object.defineProperties(this, {
      _trc: {
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
          request.vod.sendTranscodeJobStatus(this._trcStatus);
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

      updateTrcStatusSpawn.call(this, job);

      super.job = job;
    } catch (error) {
      this.emit("error", error, this.job);
    }
  }
  // 리팩토링 필요

  exec() {
    super.exec();
    try {
      this.initTRC();
      this.execTRC();
    } catch (error) {
      this._trcScheduler.cancel();
      this.job.data.logger === "ffmpegLogger"
        ? (Choicer.ffmpegLogger = true)
        : (Choicer.ffmpegLogger2 = true);

      this._trcStatus.status = -1;
      request.vod.sendTranscodeJobStatus(this._trcStatus);

      this.emit("error", error, this.job);
      manager.cancel(this.job);
    }
  }

  async initTRC() {
    const command = transcoder.commandBuilder.command.encoding(this.job.data);
    systemLogger.Debug("ffmpeg_command", command.join(" "));
    // this.checkFile() 기능 개발 예정

    this._trc = transcoder.TRC.spawn(command);
    this.job.data.childPsId = this._trc.pid;
    this._trcScheduler;

    this._trcStatus.transactionId = this.job.id;
    this._trcStatus.status = 2;
    this._trcStatus.transcodes = [
      {
        presetCode: "",
        outputFilename: this.job.data.basic.outputFilename,
      },
    ];
    this.job.data.input = {
      totalFrame: await this.totalFrame(),
    };
  }

  execTRC() {
    this._trc.stderr.on("data", (data) => {
      this.updateTrcStatus(data);
      this._trcLogger.Info("stderr", data);
    });
    // 상태업데이트 분리시켜보기

    this._trc.on("close", (code) => {
      this.job.data.logger === "ffmpegLogger"
        ? (Choicer.ffmpegLogger = true)
        : (Choicer.ffmpegLogger2 = true);
      this._trcLogger.Debug("child process exited with code", code);
      this._trcScheduler.cancel();

      if (code === 0) {
        this._trcStatus.status = 0;
        this._trcStatus.percentage = 100;
        request.vod.sendTranscodeJobStatus(this._trcStatus);
        this.emit("end", this.job, this); // this를 같이 보내지 않으면 worker가 멈추지 않음
      } else if (code === 255) {
        this.job.code = 255;
        this._trcStatus.status = 3;
        request.vod.sendTranscodeJobStatus(this._trcStatus);
        this.emit("end", this.job);
      } else {
        this._trcStatus.status = -1;
        request.vod.sendTranscodeJobStatus(this._trcStatus);
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
      this._trcStatus.frames = trcInfo[0];
      this._trcStatus.bitrate = `${trcInfo[7]}`;
      if (dup && drop) {
        this._trcStatus.speed = `${trcInfo[10] ? trcInfo[10] : trcInfo[9]}`;
      } else {
        this._trcStatus.speed = `${trcInfo[8]}`;
      }
      this._trcStatus.status = 2;
      this._trcStatus.percentage = `${(
        (trcInfo[0] / this.job.data.input.totalFrame) *
        100
      ).toFixed(2)}`;
    }
  }

  // 나중에 오브젝트 폴더 같은 것 만들어서 모듈화 해보기
}

function updateTrcStatusSpawn(job) {
  request.vod.sendTranscodeJobStatus({
    transactionId: job.id,
    status: 1,
    transcodes: [
      {
        presetCode: "",
        outputFilename: job.data.basic.outputFilename,
      },
    ],
  });
} // 없앨 코드

module.exports = transcoderWorker1;
