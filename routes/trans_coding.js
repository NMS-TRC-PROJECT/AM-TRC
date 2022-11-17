import express from "express";
import * as controller from "../controller/controller/transcoder/trans_coding.js";
import * as validation from "../controller/validation/transcoder/trans_coding.js";

const router = express.Router();

router.post("/all", validation.trc, controller.trc);

export default router;
