import jwt from "jsonwebtoken";
import { User } from "../models/user-model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                //console.log(decoded);
                const user = await User.findById(decoded?.id);
                req.user = user;
                console.log("Authorization request");
                next();
            }
        } catch (error) {
            console.log(error);
            throw new Error(
                new ApiError(
                    error.message,
                    "Not authorized or token expired, Login again"
                )
            );
        }
    } else {
        throw new Error(new ApiError(error.message));
    }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
    //console.log("Admin", req.user);
    const { email } = req.user;
    const adminUser = await User.findOne({
        email,
    });
    if (adminUser.role !== "admin") {
        throw new Error(
            new ApiError("You are not authorized to perform this action", 401)
        );
    } else {
        next();
    }
});
