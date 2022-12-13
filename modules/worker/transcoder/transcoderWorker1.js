const transcoder = require("../../transcoder");

const logger = require("../../logger"),
  ffmpegLogger = logger.ffmpegLogger.log,
  ffmpegLogger2 = logger.ffmpegLogger.log2,
  systemLogger = logger.systemLogger.log,
  Choicer = logger.loggerChoicer;

class transcoderWorker1 extends require("@amuzlab/worker").Worker {
  constructor() {
    super();
    this.duration = null;
    this.trcStatus = {};
    this.trcStatus2 = {};
    this.postTrcStatus = () => {
      return setInterval(() => {
        // post 요청 보내면 됨
        console.log(this.trcStatus, 1);
      }, 5000);
    };
    this.postTrcStatus2 = () => {
      return setInterval(() => {
        console.log(this.trcStatus2, 2);
        //post 요청 보내면 됨
      }, 5000);
    };
  }

  async exec() {
    const job = this.job,
      command = transcoder.commandBuilder.command.encoding(job.data),
      ts = transcoder.TRC.spawn(command),
      duration = await this.getFileDuration(
        job.data.basic.inputFolder,
        job.data.basic.inputFilename
      ); // 12-15 여기부터 시작하면 됨.. 총 frame 개수 구하면 됨

    job.data.childPsId = ts.pid;
    // this.checkFile() 기능 개발 예정

    this.emit("exec", job, this);

    switch (true) {
      case Choicer.ffmpegLogger && Choicer.ffmpegLogger2:
        Choicer.ffmpegLogger = false;
        commandLog(command);

        ts.stderr.on("data", (data) => {
          this.setTrcStatus(data, duration);
          stderrLog(data);
        });

        let intervalId = this.postTrcStatus();

        ts.on("close", (code) => {
          closeLog(code);
          Choicer.ffmpegLogger = true;

          clearInterval(intervalId);
          console.log(this.trcStatus, 1);

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
          this.setTrcStatus2(data);
          stderrLog2(data);
        });

        let intervalId2 = this.postTrcStatus2();

        ts.on("close", (code) => {
          closeLog2(code);
          Choicer.ffmpegLogger2 = true;
          clearInterval(intervalId2);
          console.log(this.trcStatus2, 2);

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
          this.setTrcStatus(data);
          stderrLog(data);
        });

        let intervalId3 = this.postTrcStatus();

        ts.on("close", (code) => {
          closeLog(code);
          Choicer.ffmpegLogger = true;
          clearInterval(intervalId3);
          console.log(this.trcStatus, 3);

          this.trcStatus = {};

          if (code === 0) this.emit("end", job, this);
          else if (code === 255) (job.code = 255), this.emit("end", job);
          else this.emit("error", `error code ${code}`, job);
        });
        break;
    }
  }

  async getFileDuration(inputFolder, inputFilename) {
    // let isDuration;
    // let duration;
    return String(
      await transcoder.TRC.getFileDuration(`${inputFolder}/${inputFilename}`)
    ).match(/([0-9][0-9]):([0-5][0-9]):([0-5][0-9]).([0-9][0-9]),/g)?.[0];
  }

  setTrcStatus(data, totalFrame) {
    let frame = String(data).match(/^frame/)?.[0], // stderr에서 log 정보가 있는 경우를 찾기 위해 사용
      trcInfo = String(data).match(/(\d*\.?\d+)/g),
      dup = String(data).match(/dup/)?.[0],
      drop = String(data).match(/drop/)?.[0];

    if (frame) {
      this.trcStatus.frame = trcInfo[0];
      this.trcStatus.bitrate = `${trcInfo[7]}kbits/s`;
      if (dup && drop) {
        this.trcStatus.speed = `${trcInfo[10]}x`;
      } else {
        this.trcStatus.speed = `${trcInfo[8]}x`;
      }
      this.trcStatus.status = 2;
      //   this.trcStatus.percentage;
    }
  }

  setTrcStatus2(data) {
    let frame = String(data).match(/^frame/)?.[0];
    let trcInfo = String(data).match(/(\d*\.?\d+)/g);
    let dup = String(data).match(/dup/)?.[0];
    let drop = String(data).match(/drop/)?.[0];
    if (frame) {
      this.trcStatus2.frame = trcInfo[0];
      this.trcStatus2.bitrate = `${trcInfo[7]}kbits/s`;
      if (dup && drop) {
        this.trcStatus2.speed = `${trcInfo[10]}x`;
      } else {
        this.trcStatus2.speed = `${trcInfo[8]}x`;
      }
      this.trcStatus2.status = 2;
    }
  }
  // setTrcStatus 간소화 필요

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

/* 
1. 케이스 별로 나눈 것 하나로 만들고 
2. 기능들 따로 분리하기 (실행은 실행만, 로깅은 로깅만)
3. 하나의 함수에 하나에 기능만 넣기
4. 내 생각으로는 init trc에 기능을 추가하면 될 듯..? */
