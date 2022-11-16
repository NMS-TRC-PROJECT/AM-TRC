import express from "express";
import { trans_coding } from "../controller/trans_coding.js";

const router = express.Router();

router.post("/all", trans_coding);

export default router;
