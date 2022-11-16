import { exec } from "child_process";
import { ts } from "../modules/trans_coding.js";

export const trans_coding = (req, res) => {
  try {
    const { input, resolution, video_c, audio_c, Kbps_v, output } = req.body;

    exec(
      ts(input, resolution, video_c, audio_c, Kbps_v, output),
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error.toString()}`);
          return;
        }
        console.log(`stdout: ${stdout.toString()}`);
        console.log(`stderr: ${stderr.toString()}`);
      }
    );

    return res.status(201).json({ resultCode: 201, errorString: "" });
  } catch (error) {
    return res.status(500).json({
      resultCode: 500,
      errorString: `${error.name}, ${error.message}`,
    });
  }
};
