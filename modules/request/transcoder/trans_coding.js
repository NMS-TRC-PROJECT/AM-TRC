const { spawn } = require("child_process");
const Logger = require("@amuzlab/logger")({
  level: "debug",
  timestamp: true,
  timeFormat: "YYYY-MM-DD HH:mm:ss",
  transport: "file",
  logDir: "~/log",
  logFileName: "out",
  datePattern: "YYYY-MM-DD",
  maxSize: "50m",
  maxFiles: "10d",
});

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

  spawn: {
    enumerable: true,
    value: (command) => {
      Logger.info("log message %s", `ffmpeg command : ${command}`);
      spawn(ffmpeg, command).on("close", (code) => {
        Logger.info(
          "log message %s",
          `child process exited with code : ${code}`
        );
      });
    },
  },

  logger: {
    enumerable: true,
    value: () => {
      // Logger.debug("log message", "debug");
      // Logger.info("log message %s", "info");
      // Logger.warn("log message %s %j", "warn");
      // Logger.error("log message %s %j", new Error("error"));
    },
  },
});
