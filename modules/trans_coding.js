import dotenv from "dotenv";
dotenv.config();
const ffmpeg = process.env.FFMPEG;

export const trc = (input, resolution, video_c, audio_c, Kbps_v, output) => {
  let command = `${ffmpeg} -i /home/shlee/${input}`;
  if (resolution) command += ` -s ${resolution}`;
  if (video_c) command += ` -c:v ${video_c}`;
  if (audio_c) command += ` -c:a ${audio_c}`;
  if (Kbps_v) command += ` -b:v ${Kbps_v}k`;
  command += ` /home/shlee/${output}`;

  return command;
};
