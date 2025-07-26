import { Router } from "express";
import userAuth from "../middlewares/auth.middleware.js";
import { getUserData } from "../controller/user.controller.js";

const router = Router();

router.route("/data").get(userAuth, getUserData)

export default router;