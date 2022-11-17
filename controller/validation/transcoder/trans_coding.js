import * as module from "../../../modules/trans_coding.js";

export const trc = (req, res, next) => {
  const { input, width, height, video_c, audio_c, Kbps_v, output } = req.body;
  const err_msg = [];
  let resolution = "";

  if (!input) err_msg.push("check source file");

  if (width || height) {
    if (typeof width !== "number" || typeof height !== "number") {
      err_msg.push("check resolution");
    } else {
      resolution = `${width}*${height}`;
    }
  }

  if (video_c && typeof video_c !== "string") err_msg.push("check c:v");
  if (video_c && typeof audio_c !== "string") err_msg.push("check c:a");

  if (typeof Kbps_v !== "number") err_msg.push("check b");

  if (!output) err_msg.push("check out file");

  if (err_msg.length === 0) {
    res.locals.command = module.trc(
      input,
      resolution,
      video_c,
      audio_c,
      Kbps_v,
      output
    );
    next();
  } else {
    const error = new Error(err_msg.join(" and "));
    error.status = 400;
    next(error);
  }
};
