require("dotenv").config();

const path = require("path"),
  ROOT_PATH = path.join(__dirname, "..", "..", "..", "..");

Object.defineProperties(exports, {
  encoding: {
    enumerable: true,
    value: (obj) => {
      const {
        outputs: { container, outputType, video, audio },
        basic: { filename, outputFolder, sourcePath },
      } = obj;
      const resolution = `${video.resolutionWidth}*${video.resolutionHeight}`;

      const command = ["-y", "-i", `${ROOT_PATH}${sourcePath}/${filename}`];
      if (video.codec) command.push("-c:v", `${videoCodecs[video.codec]}`);
      if (video.quality) command.push("-q:v", `${video.quality}`);
      if (video.bitrate) command.push("-vb", `${video.bitrate}k`);
      if (video.framerate) command.push("-r", `${video.framerate}`);
      if (resolution) command.push("-s", `${resolution}`);
      if (audio.codec) command.push("-c:a", `${audioCodecs[audio.codec]}`);
      if (audio.bitrate) command.push("-ab", `${audio.bitrate}k`);
      command.push(`${ROOT_PATH}${outputFolder}.${containers[container]}`);
      return command;
    },
  },
  // -vframes (number) 비디오 프레임 수 지정, 이건 최대 몇개 프레임 쓸 것인지 조정하는 옵션.. fbs에 대한 옵션을 넣어야 됨
  // -r 프레임 레이트 조정 fbs
  // -vb 비디오 비트레이트 설정, / 실수 (단위 k로 하기 기본 1000k)
  // -q:v 고정 품질 척도(VBR), 낮을 수록 좋음 / 정수? ... 일단 실수
  // -ab 오디오 비트레이트 설정 / 정수? ..일단 실수 (단위 k로 하기 기본 64k)
  validation: {
    enumerable: true,
    value: (obj) => {
      const {
        outputs: { container, outputType, video, audio },
        basic: { filename, sourcePath, outputFolder },
      } = obj;

      err_msg = [];
      try {
        if (outputTypes[outputType] === "FILE") {
          if (!containers[container]) err_msg.push("check container");
        } else err_msg.push("NO FILE");

        if (!filename) err_msg.push("check filename");
        if (!outputFolder) err_msg.push("check outputFolder");
        if (!sourcePath) err_msg.push("check sourcePath");

        if (video.codec && !videoCodecs[video.codec]) err_msg.push("check c:v");

        if (video.quality && typeof video.quality !== "number") {
          err_msg.push("check q");
        }
        if (video.bitrate && typeof video.bitrate !== "number") {
          err_msg.push("check vb");
        }
        if (video.framerate && typeof video.framerate !== "number") {
          err_msg.push("check vframes");
        }
        if (video.resolutionWidth || video.resolutionHeight) {
          if (
            typeof video.resolutionWidth !== "number" ||
            typeof video.resolutionHeight !== "number"
          )
            err_msg.push("check s");
        }

        if (audio.codec && !audioCodecs[audio.codec]) err_msg.push("check c:a");

        if (audio.bitrate && typeof audio.bitrate !== "number") {
          err_msg.push("check ab");
        }

        if (err_msg.length !== 0) {
          const error = err_msg.join(", ");
          error.status = 400;
          throw new Error(error);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
});
// vaildatain 모듈화 해보기, 정규식으로 바꾸기, 확장성 썩었는데...

const containers = {
  "MPEG-TS": "ts",
  "MPEG-4": "mp4",
  // MP3: "mp3",
  // IMAGE: "jpg",
};

const outputTypes = {
  // UDP: "",
  // HLS: "",
  // ASI_CARD: "",
  // DASH: "",
  FILE: "FILE",
};

const videoCodecs = {
  COPY: "copy",
  "H.264": "h264",
  "H.265": "hevc",
};
const audioCodecs = {
  COPY: "copy",
  "AAC-LC": "aac",
  // "AAC-LC": "libfdk_aac",
};
