import User from "../models/auth.model.js";
import { ApiError } from "../utils/apiError.js";

export const getUserData = async (req, res) => {
    try {

        const {userId} = req.body;

        const user = await User.findById(userId);

        if(!user) {
            return res.json(new ApiError(404, "User not found"))
        }

        return res
        .status(200)
        .json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        })

    } catch (error) {
        
    }
}
