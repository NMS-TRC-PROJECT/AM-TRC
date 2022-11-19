import { spawn } from "child_process";
import dotenv from "dotenv";
dotenv.config();

export const trc = (req, res) => {
  const cwd = process.env.FFMPEG_LOCAL;
  const { command } = res.locals;
  console.log(command);

  const ts = spawn("ffmpeg", command, {
    cwd,
  });

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
};
