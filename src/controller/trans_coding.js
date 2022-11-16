import { exec } from "child_process";
import dotenv from "dotenv";
dotenv.config();

const ffmpeg = process.env.FFMPEG;

export const trans_coding = (req, res) => {
  try {
    const { input, resolution, video_c, audio_c, Kbps_v, output } = req.body;

    let command = `${ffmpeg} -i /home/shlee/${input}`;
    if (resolution) command += ` -s ${resolution}`;
    if (video_c) command += ` -c:v ${video_c}`;
    if (audio_c) command += ` -c:a ${audio_c}`;
    if (Kbps_v) command += ` -b:v ${Kbps_v}`;
    command += ` /home/shlee/${output}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error.toString()}`);
        return;
      }
      console.log(`stdout: ${stdout.toString()}`);
      console.log(`stderr: ${stderr.toString()}`);
    });

    return res.status(201).json({ resultCode: 201, errorString: "" });
  } catch (error) {
    return res.status(500).json({
      resultCode: 500,
      errorString: `${error.name}, ${error.message}`,
    });
  }
};
