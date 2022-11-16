import express from "express";
import morgan from "morgan";
import { exec } from "child_process";

const app = express();




app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("port", process.env.PORT || 3000);

app.get("/api/ts", (req, res) => {
    const {source_video} = req.body;

 exec("pwd",(error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error.toString()}`);
          return;
        }
        console.log(`stdout: ${stdout.toString()}`);
        console.log(`stderr: ${stderr.toString()}`);
      });

    res.json({ hi: "hello" });
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