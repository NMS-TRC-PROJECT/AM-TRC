const { spawn } = require("child_process");
const { exec } = require("child_process");

require("dotenv").config();
// const ffmpeg = process.env.FFMPEG_OFFICE;
// const PWD = process.env.OFFICE_PWD_PATH;

const ffmpeg = process.env.FFMPEG_LOCAL;
const PWD = process.env.LOCAL_PWD_PATH;

Object.defineProperties(exports, {
  encoding_command: {
    enumerable: true,
    value: (input, resolution, video_c, audio_c, Kbps_v, output) => {
      let command = ["-y", "-i", `${PWD}/${input}`];
      if (resolution) command.push("-s", `${resolution}`);
      if (video_c) command.push("-c:v", `${video_c}`);
      if (audio_c) command.push("-c:a", `${audio_c}`);
      if (Kbps_v) command.push("-b:v", `${Kbps_v}k`);
      command.push(`${PWD}/${output}`);
      return command;
    },
  },

  trc_spawn: {
    enumerable: true,
    value: (command) => {
      const ts = spawn(ffmpeg, command);

      return ts;
      /*   return new Promise((resolve, reject) => {
        ffmpegLogger.ffmpegInfo("command", command.join(" "));
        systemLogger.systemInfo("ffmpeg_command", command.join(" "));

        const ts = spawn(ffmpeg, command);
        ts.stderr.on("data", (data) => {
          ffmpegLogger.ffmpegInfo("stderr", data);
        });

        ts.on("close", (code) => {
          ffmpegLogger.ffmpegInfo("child process exited with code", code);
          systemLogger.systemInfo("child process exited with code", code);
          resolve({ end: "end" });
        });

        // ts.kill();
      }); */
    },
  },

  psKill: {
    enumerable: true,
    value: (id) => {
      exec(`kill -15 ${id}`);
    },
  },
});
