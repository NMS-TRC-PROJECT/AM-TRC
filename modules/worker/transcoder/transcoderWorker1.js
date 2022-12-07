const transcoder = require("../../transcoder");

const logger = require("../../logger"),
  ffmpegLogger = logger.ffmpegLogger.log,
  ffmpegLogger2 = logger.ffmpegLogger.log2,
  systemLogger = logger.systemLogger.log,
  Choicer = logger.loggerChoicer;

class transcoderWorker1 extends require("@amuzlab/worker").Worker {
  constructor() {
    super();
    this.trcStatus = {};
    this.trcStatus2 = {};
    this.jobStateUpdate = () => {
      return setInterval(() => {
        // post 요청 보내면 됨
        console.log(this.trcStatus, 1);
      }, 3000);
    };
    this.jobStateUpdate2 = () => {
      return setInterval(() => {
        console.log(this.trcStatus2, 02);
        //post 요청 보내면 됨
      }, 3000);
    };
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
          this.trcStateReqExp(data);
          stderrLog(data);
        });

        let intervalId = this.jobStateUpdate();

        ts.on("close", (code) => {
          closeLog(code);
          Choicer.ffmpegLogger = true;

          clearInterval(intervalId);

          this.trcStatus = {};

          if (code === 0) this.emit("end", job, this);
          else if (code === 255) (job.code = 255), this.emit("end", job);
          else this.emit("error", `error code ${code}`, job);
        });
        break;

      case Choicer.ffmpegLogger === false && Choicer.ffmpegLogger2 === true:
        Choicer.ffmpegLogger2 = false;
        commandLog2(command);

        ts.stderr.on("data", (data) => {
          this.trcStateReqExp2(data);
          stderrLog2(data);
        });

        let intervalId2 = this.jobStateUpdate2();

        ts.on("close", (code) => {
          closeLog2(code);
          Choicer.ffmpegLogger2 = true;
          clearInterval(intervalId2);

          this.trcStatus2 = {};

          if (code === 0) this.emit("end", job, this);
          else if (code === 255) (job.code = 255), this.emit("end", job);
          else this.emit("error", `error code ${code}`, job);
        });
        break;

      case Choicer.ffmpegLogger === true && Choicer.ffmpegLogger2 === false:
        Choicer.ffmpegLogger = false;
        commandLog(command);

        ts.stderr.on("data", (data) => {
          this.trcStateReqExp(data);
          stderrLog(data);
        });

        let intervalId3 = this.jobStateUpdate();

        ts.on("close", (code) => {
          closeLog(code);
          Choicer.ffmpegLogger = true;
          clearInterval(intervalId3);

          this.trcStatus = {};

          if (code === 0) this.emit("end", job, this);
          else if (code === 255) (job.code = 255), this.emit("end", job);
          else this.emit("error", `error code ${code}`, job);
        });
        break;
    }
  }

  trcStateReqExp(data) {
    let frame = String(data).match(/^frame/)?.[0]; // stderr에서 frame만 있는 경우를 찾기 위해 사용
    let trcInfo = String(data).match(/(\d*\.?\d+)/g);
    if (frame) {
      this.trcStatus.frame = trcInfo[0];
      this.trcStatus.fbs = trcInfo[1];
      this.trcStatus.q = trcInfo[2];
      this.trcStatus.size = `${trcInfo[3]}KB`;
      this.trcStatus.time = `${trcInfo[4]}:${trcInfo[5]}:${trcInfo[6]}`;
      this.trcStatus.bitrate = `${trcInfo[7]}kbits/s`;
      this.trcStatus.speed = `${trcInfo[8]}x`;
    }
  }

  trcStateReqExp2(data) {
    let frame = String(data).match(/^frame/)?.[0];
    let trcInfo = String(data).match(/(\d*\.?\d+)/g);
    if (frame) {
      this.trcStatus2.frame = trcInfo[0];
      this.trcStatus2.fbs = trcInfo[1];
      this.trcStatus2.q = trcInfo[2];
      this.trcStatus2.size = `${trcInfo[3]}KB`;
      this.trcStatus2.time = `${trcInfo[4]}:${trcInfo[5]}:${trcInfo[6]}`;
      this.trcStatus2.bitrate = `${trcInfo[7]}kbits/s`;
      this.trcStatus2.speed = `${trcInfo[8]}x`;
    }
  }
  // trcStateReqExp 간소화 필요

  // swicth 부분에서 job 상태 업데이트 정보 계속 보내주기
  // 에러처리도 같이 -1,0,1 .. 등등
  // 더 간단하게 만들어보기
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
