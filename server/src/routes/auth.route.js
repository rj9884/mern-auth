import { Router } from "express";
import {
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    sendResetOtp,
    resetPassword
} from "../controller/auth.controller.js";

import userAuth from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/send-verify-otp').post(userAuth, sendVerifyOtp);
router.route('/verify-account').post(userAuth, verifyEmail);
router.route('/is-auth').get(isAuthenticated);
router.route('/send-reset-otp').post(sendResetOtp);
router.route('/reset-password').post(resetPassword);



export default router;
