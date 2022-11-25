const express = require("express"),
  morgan = require("morgan"),
  routes = require("./routes"),
  cors = require("cors"),
  systemLogger = require("./modules/logger/systemLogger");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("port", process.env.PORT || 3000);

app.use(
  "/routes",
  (req, res, next) => {
    systemLogger.systemInfo(
      "server info %s",
      `method ${req.method}, Url ${req.originalUrl}, body ${JSON.stringify(
        req.body
      )}`
    );
    next();
  },
  routes
);

app.use((err, req, res, next) => {
  systemLogger.systemError("server error (err : %s)", err.stack);
  return res.json({
    success: false,
    message: err.message,
    result: err,
  });
});

app.listen(app.get("port"), () => {
  console.log(`listening ${app.get("port")}`);
});
