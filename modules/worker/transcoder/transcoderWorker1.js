const transcoder = require("../../transcoder");

const logger = require("../../logger"),
  ffmpegLogger = logger.ffmpegLogger.log,
  ffmpegLogger2 = logger.ffmpegLogger.log2,
  systemLogger = logger.systemLogger.log,
  Choicer = logger.loggerChoicer;

class transcoderWorker1 extends require("@amuzlab/worker").Worker {
  constructor() {
    super();
  }

  exec() {
    const job = this.job,
      command = transcoder.commandBuilder.command.encoding(job.data.spec);

    const ts = transcoder.TRC.spawn(command);
    job.data.childPsId = ts.pid;

    this.emit("exec", job, this);

    switch (true) {
      case Choicer.ffmpegLogger && Choicer.ffmpegLogger2:
        Choicer.ffmpegLogger = false;
        commandLog(command);

        ts.stderr.on("data", (data) => {
          console.log(`${data}`);
          stderrLog(data);
        });

        ts.on("close", (code) => {
          closeLog(code);
          Choicer.ffmpegLogger = true;

          if (code === 0) this.emit("end", job, this);
          else if (code === 255) (job.code = 255), this.emit("end", job);
          else this.emit("error", `error code ${code}`, job);
        });
        break;

      case Choicer.ffmpegLogger === false && Choicer.ffmpegLogger2 === true:
        Choicer.ffmpegLogger2 = false;
        commandLog2(command);

        ts.stderr.on("data", (data) => {
          stderrLog2(data);
        });

        ts.on("close", (code) => {
          closeLog2(code);
          Choicer.ffmpegLogger2 = true;

          if (code === 0) this.emit("end", job, this);
          else if (code === 255) (job.code = 255), this.emit("end", job);
          else this.emit("error", `error code ${code}`, job);
        });
        break;

      case Choicer.ffmpegLogger === true && Choicer.ffmpegLogger2 === false:
        Choicer.ffmpegLogger = false;
        commandLog(command);

        ts.stderr.on("data", (data) => {
          stderrLog(data);
        });

        ts.on("close", (code) => {
          closeLog(code);
          Choicer.ffmpegLogger = true;

          if (code === 0) this.emit("end", job, this);
          else if (code === 255) (job.code = 255), this.emit("end", job);
          else this.emit("error", `error code ${code}`, job);
        });
        break;
    }
  }

  // swicth 부분에서 job 상태 업데이트 정보 계속 보내주기
  // 에러처리도 같이 -1,0,1 .. 등등
}

function commandLog(command) {
  ffmpegLogger.ffmpegDebug("command", command.join(" "));
  systemLogger.systemDebug("ffmpeg_command", command.join(" "));
}
function commandLog2(command) {
  ffmpegLogger2.ffmpegDebug("command", command.join(" "));
  systemLogger.systemDebug("ffmpeg_command", command.join(" "));
}

function stderrLog(data) {
  ffmpegLogger.ffmpegInfo("stderr", data);
}
function stderrLog2(data) {
  ffmpegLogger2.ffmpegInfo("stderr", data);
}

function closeLog(code) {
  ffmpegLogger.ffmpegDebug("child process exited with code", code);
  systemLogger.systemDebug("child process exited with code", code);
}
function closeLog2(code) {
  ffmpegLogger2.ffmpegDebug("child process exited with code", code);
  systemLogger.systemDebug("child process exited with code", code);
}
// 이게 최선의 방법인가??... 안좋은듯...
// 확장성이 떨어짐, 고도화 작업 해보기

module.exports = transcoderWorker1;
