import { exec } from "child_process";

export const trc = (req, res) => {
  const { command } = res.locals;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error.toString()}`);
      return;
    }
    console.log(`stdout: ${stdout.toString()}`);
    console.log(`stderr: ${stderr.toString()}`);
  });

  return res.status(201).json({ resultCode: 201, errorString: "" });
};
