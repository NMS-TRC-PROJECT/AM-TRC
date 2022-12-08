require("dotenv").config();

const path = require("path"),
  ROOT_PATH = path.join(__dirname, "..", "..", "..", "..", "mnt");
// ROOT_PATH = path.join(__dirname, "..", "..", "..", "..");

Object.defineProperties(exports, {
  encoding: {
    enumerable: true,
    value: (spec) => {
      const { input, width, height, video_c, audio_c, Kbps_v, output } = spec;
      let resolution = `${width}*${height}`;

      let command = ["-y", "-i", `${ROOT_PATH}/input/${input}`];
      if (resolution) command.push("-s", `${resolution}`);
      if (video_c) command.push("-c:v", `${video_c}`);
      if (audio_c) command.push("-c:a", `${audio_c}`);
      if (Kbps_v) command.push("-b:v", `${Kbps_v}k`);
      command.push(`${ROOT_PATH}/output/${output}`);
      return command;
    },
  },

  validation: {
    enumerable: true,
    value: (obj) => {
      let outputs = obj.outputs,
        video = outputs.video,
        audio = outputs.audio,
        basic = obj.basic,
        err_msg = [];
      try {
        if (outputType[outputs.outputType] === "FILE") {
          if (!container[outputs.container]) err_msg.push("check container");
        } else err_msg.push("still getting ready");

        if (!basic.filename) err_msg.push("check filename");
        if (!basic.outputFolder) err_msg.push("check outputFolder");
        if (video.resolutionWidth || video.resolutionHeight) {
          if (
            typeof video.resolutionWidth !== "number" ||
            typeof video.resolutionHeight !== "number"
          ) {
            err_msg.push("check resolution");
          }
        }
        if (video.codec && typeof video.codec !== "string") {
          err_msg.push("check c:v");
        }
        if (audio.codec && typeof audio.codec !== "string")
          err_msg.push("check c:a");

        // if (typeof Kbps_v !== "number") err_msg.push("check b");
        if (err_msg.length !== 0) {
          const error = err_msg.join(" and ");
          error.status = 400;
          throw new Error(error);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
});

const container = {
  "MPEG-TS": "ts",
  "MPEG-4": "mp4",
  MP3: "mp3",
  IMAGE: "jpg",
};

const outputType = {
  // UDP: "",
  // HLS: "",
  // ASI_CARD: "",
  // DASH: "",
  FILE: "FILE",
};
