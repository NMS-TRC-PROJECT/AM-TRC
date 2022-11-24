const express = require("express"),
  morgan = require("morgan"),
  routes = require("./routes"),
  cors = require("cors"),
  system_logger = require("./modules/logger/system_logger");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("port", process.env.PORT || 3000);

app.use(
  "/routes",
  (req, res, next) => {
    system_logger.system_info(
      "server info",
      `method ${req.method}, Url ${req.originalUrl}`
    );
    next();
  },
  routes
);

app.use((err, req, res, next) => {
  system_logger.system_info("server error (err : %s)", err.stack);
  return res.json({
    success: false,
    message: err.message,
    result: err,
  });
});

app.listen(app.get("port"), () => {
  console.log(`listening ${app.get("port")}`);
});
