import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import User from "../models/auth.model.js";
import transporter from "../nodemailer/nodemailer.js";
import { mailOptions, } from "../nodemailer/mailOptions.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../utils/emailTemplate.js";


const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) res.json(new ApiError(401, "Missing Details"));

    try {
        const existingUser = await User.findOne({ email })

        if (existingUser) return res.json(new ApiError(403, "User already exists"));

        const user = new User({ name, email, password });

        await user.save();

        const token = user.generateToken();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const emailData = new mailOptions({
            to: email,
            text: `Hey ${name}!!/n Your account has been created successfully using ${email}!`
        });

        await transporter.sendMail(emailData);



        res.status(200)
            .json(new ApiResponse(201, "User Registered Successfully"))

    } catch (error) {
        throw new ApiError(401, error);

    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.json(new ApiError(400, "Email and Password are required"))

    try {
        const user = await User.findOne({ email });

        if (!user) return res.json(new ApiError(404, "Invalid email"))

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) return res.json(new ApiError(401, "Invalid Password")); 

        const token = user.generateToken();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200)
            .json(new ApiResponse(201, "User loggedIn Successfully"))



    } catch (error) {
        throw new ApiError(401, `Error: ${error}`);

    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",

        }
        )
        return res.status(200).json(new ApiResponse(201, "User loggedOut Successfully"))

    } catch (error) {
        throw new ApiError(500, `Error: ${error}`);

    }
}

const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (user.isAccountVerified) return res.json(new ApiError(405, "Account Already Verified"))

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const emailData = new mailOptions({
            to: user.email,
            subject: 'Account Verification OTP',
            // text: `Your OTP is ${otp}. Verify account using this OTP.`
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        });

        await transporter.sendMail(emailData);

        return res.status(200)
            .json(new ApiResponse(201, "Verification OTP Sent on Email"));




    } catch (error) {
        throw new ApiError(500, `Error: ${error}`);
    }
}

const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) return res.json(new ApiError(401, 'Missing Details!!'))
    try {
        const user = await User.findById(userId);

        if (!user) return res.json(new ApiError(404, "User not Found"))

        if (user.verifyOtp === '' || user.verifyOtp !== otp) return res.json(new ApiError(408, "Invalid OTP"))

        if (user.verifyOtpExpireAt < Date.now()) return res.json(new ApiError(100, "OTP Expired"));

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.status(200).json(new ApiResponse(201, "Email Verified Successfully"));

    } catch (error) {
        throw new ApiError(500, "Email could not be verified!")
    }


}

const isAuthenticated = async (req, res) => {
    try {

        return res.json(new ApiResponse(201, "User is Authenticated"));
        
    } catch (error) {

        throw new ApiError(400, `Error: ${error}`)
    }
}

//Send Password Reset OTP

const sendResetOtp = async (req, res) => {
    const {email} = req.body;

    if(!email) {
        return res.json(new ApiError(402, "Email is required!"))
    }

    try {
        
        const user = await User.findOne({email});

        if(!user) {
            return res.json(new ApiError(404, "User not found"));
        } 

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 60 * 1000

        await user.save();

        const emailData = new mailOptions({
            to: user.email,
            subject: 'Password Reset OTP',
            // text: `Your OTP for resetting Your password is ${otp}. Use this OTP to reset your password.`
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        });

        await transporter.sendMail(emailData);

        return res.status(200)
            .json(new ApiResponse(201, "OTP Sent on Your Email"));
        
    } catch (error) {
        throw new ApiError(400, `Error: ${error}`)
    }
}

//Reset User Password

const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword) {
        return res.json(new ApiError(400, "Email, Password, and OTP are required"))
    }

    try {
        
        const user = await User.findOne({email});

        if(!user) {
            return res.json(new ApiError(404, "User not found"));
        }

        if(user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json(new ApiError(402, "Invalid OTP"))
        }

        if(user.resetOtpExpireAt < Date.now()) {
            return res.json(new ApiError(501, "OTP Expired"));
        }

        user.password = newPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.status(200).json(new ApiResponse(201, "Password has been reset successfully."))

    } catch (error) {
        
    }
}

export {
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    sendResetOtp,
    resetPassword
}