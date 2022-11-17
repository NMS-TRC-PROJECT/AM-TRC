import express from "express";
const router = express.Router();

import ts_router from "../routes/trans_coding.js";

router.use("/ts", ts_router);

export default router;
