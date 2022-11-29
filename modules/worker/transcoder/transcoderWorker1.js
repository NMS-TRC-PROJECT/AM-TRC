const trc = require("../../../modules/request/transcoder/trans_coding");
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

  async exec() {
    const job = this.job;
    this.emit("exec", job, this);

    const result = await trc.spawn(command, job.data.id);
    console.log(result);
    this.emit(result.end, job, this);
  }
}

module.exports = transcoderWorker1;
