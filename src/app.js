import express from "express";
import morgan from "morgan";
import { exec } from "child_process";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("port", process.env.PORT || 3000);

app.post("/api/ts", (req, res) => {
  const { source_video } = req.body;
  const ffmpeg =
    "LD_LIBRARY_PATH=/home/shlee/ffmpeg_220916/libs:/home/shlee/ffmpeg_220916/libs/cuda /home/shlee/ffmpeg_220916/ffmpeg";

  exec(
    `${ffmpeg} -i /home/shlee/${source_video} -s 1920*1080 -c:v libx264 -b:v 5000k -c:a aac /home/shlee/out_8.ts`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error.toString()}`);
        return;
      }
      console.log(`stdout: ${stdout.toString()}`);
      console.log(`stderr: ${stderr.toString()}`);
    }
  );

  res.json({ resultCode: 201, errorString: "" });
});

app.use((req, res, next) => {
  const error = new Error(
    `메서드 ${req.method} 경로 ${req.url} 존재하지 않습니다.`
  );
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  return res.json({
    success: false,
    message: err.message,
    result: err,
  });
});

app.listen(app.get("port"), () => {
  console.log(`listening ${app.get("port")}`);
});
