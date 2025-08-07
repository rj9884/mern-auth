import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if(!token) return res.json(new ApiError(408, "Not Authorized. Login Again"))

        try {
            
            const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if(decodedtoken._id) {
                req.body = req.body || {};
                req.body.userId = decodedtoken._id
            }else {
                return res.json(new ApiError(401, "Not Authorized. Login Again"));
            }

            next();
            
        } catch (error) {
            throw new ApiError(400, `Error: ${error}`);
            
        }
}

export default userAuth;   