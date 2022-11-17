import express from "express";
import morgan from "morgan";
import router from "./routes/index.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("port", process.env.PORT || 3000);

app.use("/api", router);

app.use((err, req, res, next) => {
  return res.status(err.status).json({
    success: false,
    message: err.message,
    result: err,
  });
});

app.listen(app.get("port"), () => {
  console.log(`listening ${app.get("port")}`);
});
