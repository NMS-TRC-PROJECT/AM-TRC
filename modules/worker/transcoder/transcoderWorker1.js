const trc = require("../../../modules/request/transcoder/trans_coding");

const logger = require("../../logger"),
  ffmpegLogger = logger.ffmpegLogger.log,
  ffmpegLogger2 = logger.ffmpegLogger.log2,
  systemLogger = logger.systemLogger.log,
  Choicer = logger.loggerChoicer;

const path = require("path"),
  ROOT_PATH = path.join(__dirname, "..", "..", "..");

const manager = require("../../../modules/manager");

const command = [
  "-y",
  "-i",
  "/home/shlee/out_3.ts",
  "-s",
  "300*300",
  "-c:v",
  "libx264",
  "-c:a",
  "aac",
  "-b:v",
  "100k",
  "/home/shlee/out_4.ts",
];

// 회사 용

/* const command = [
  "-y",
  "-i",
  `${ROOT_PATH}/4.mp4`,
  "-s",
  "1080*720",
  "-c:v",
  "libx264",
  "-c:a",
  "aac",
  "-b:v",
  "1000k",
  `${ROOT_PATH}/out4.mp4`,
]; */
// 로컬 용

class transcoderWorker1 extends require("@amuzlab/worker").Worker {
  constructor() {
    super();
  }

  exec() {
    const job = this.job;
    this.emit("exec", job, this);
    const ts = trc.trc_spawn(command, job.data.id);
    job.data.childPsId = ts.pid;

    switch (true) {
      case Choicer.ffmpegLogger && Choicer.ffmpegLogger2:
        Choicer.ffmpegLogger = false;

        commandLog(command);

        ts.stderr.on("data", (data) => {
          stderrLog(data);
        });

        ts.on("close", (code) => {
          closeLog(code);
          Choicer.ffmpegLogger = true;
          if (code === 0) this.emit("end", job, this);
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
        });
        break;
    }
  }
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
