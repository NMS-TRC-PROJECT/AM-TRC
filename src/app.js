import express from "express";
import morgan from "morgan";
import router from "./routes/index.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("port", process.env.PORT || 3000);

app.use("/api", router);

app.use((req, res, next) => {
  const error = new Error(
    `메서드 ${req.method} 경로 ${req.url} 존재하지 않습니다.`
  );
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  return res.status(404).json({
    success: false,
    message: err.message,
    result: err,
  });
});

app.listen(app.get("port"), () => {
  console.log(`listening ${app.get("port")}`);
});
