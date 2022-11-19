import dotenv from "dotenv";
dotenv.config();
const PWD = process.env.LOCAL_PWD_PATH;

export const trc = (input, resolution, video_c, audio_c, Kbps_v, output) => {
  let command = ["-y", "-i", `${PWD}/${input}`];
  if (resolution) command.push("-s", `${resolution}`);
  if (video_c) command.push("-c:v", `${video_c}`);
  if (audio_c) command.push("-c:a", `${audio_c}`);
  if (Kbps_v) command.push("-b:v", `${Kbps_v}k`);
  command.push(`${PWD}/${output}`);

  return command;
};
