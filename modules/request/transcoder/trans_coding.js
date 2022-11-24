const { spawn } = require("child_process");
const ffmpeg_logger = require("../../logger/ffmpeg_logger");

require("dotenv").config();
const ffmpeg = process.env.FFMPEG_OFFICE;
const PWD = process.env.OFFICE_PWD_PATH;
// const cwd = process.env.LOCAL_PWD_PATH;

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
  // 2> /home/shlee/logs/~/log/

  spawn: {
    enumerable: true,
    value: (command) => {
      ffmpeg_logger.ffmpeg_info("command", command.join(" "));

      const ts = spawn(ffmpeg, command);
      ts.stderr.on("data", (data) => {
        ffmpeg_logger.ffmpeg_info("stderr", data);
      });

      ts.on("close", (code) => {
        ffmpeg_logger.ffmpeg_info("child process exited with code", code);
      });
    },
  },
});
