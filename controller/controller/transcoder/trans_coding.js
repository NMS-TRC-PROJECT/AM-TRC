const { spawn } = require("child_process");
require("dotenv").config();
const cwd = process.env.FFMPEG_LOCAL;

Object.defineProperties(exports, {
  spawn: {
    enumerable: true,
    value: (req, res) => {
      const { command } = res.locals;

      const ts = spawn("/home/shlee/ffmpeg_220916/ffmpeg", command);

      ts.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      ts.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      ts.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
      });

      return res.status(201).json({ resultCode: 201, errorString: "" });
    },
  },

  process: {},
});
