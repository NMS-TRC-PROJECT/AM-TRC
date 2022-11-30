const trc = require("../../../modules/request/transcoder/trans_coding");

const ffmpegLogger = require("../../logger/ffmpegLogger");
const systemLogger = require("../../logger/systemLogger");

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
  "/C: /Users/flejd/Documents/amuzlab_study/study/4.mp4",
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
// 로컬 용 */

class transcoderWorker1 extends require("@amuzlab/worker").Worker {
  constructor() {
    super();
  }

  exec() {
    const job = this.job;
    this.emit("exec", job, this);

    const ts = trc.trc_spawn(command, job.data.id);
    job.data.childPsId = ts.pid;
    ffmpegLogger.ffmpegInfo("command", command.join(" "));
    systemLogger.systemInfo("ffmpeg_command", command.join(" "));

    ts.stderr.on("data", (data) => {
      ffmpegLogger.ffmpegInfo("stderr", data);
    });

    ts.on("close", (code) => {
      ffmpegLogger.ffmpegInfo("child process exited with code", code);
      systemLogger.systemInfo("child process exited with code", code);
      if (code === 0) this.emit("end", job, this);
    });
  }
}

module.exports = transcoderWorker1;
