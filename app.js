const http = require("http");

const express = require("express"),
  morgan = require("morgan"),
  routes = require("./routes"),
  cors = require("cors"),
  logger = require("./modules/logger");

const app = express(),
  server = http.createServer(app);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("port", process.env.PORT || 3000);

app.use(
  "/",
  (req, res, next) => {
    logger.systemLogger.log.Info(
      "server info %s",
      `method ${req.method}, Url ${req.originalUrl}}`
    );
    next();
  },
  routes
);
app.use((err, req, res, next) => {
  logger.systemLogger.log.Error("server error (err : %s)", err.stack);
  return res.status(500).json({
    success: false,
    message: err.message,
    result: err,
  });
});

server.listen(app.get("port"), () => {
  logger.systemLogger.log.Info(
    "server info %s",
    `server start ${app.get("port")} port`
  );
});

server.on("close", () => {
  logger.systemLogger.log.Info(
    "server info %s",
    `server close ${app.get("port")} port`
  );
});
