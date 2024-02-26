import { User } from "../models/user-model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import generateToken from "../config/jwtToken.js";
import { validateMongoId } from "../utils/validateMongoId.js";
import generateRefreshToken from "../config/refreshToken.js";

// Create user account (Register)

export const createUser = asyncHandler(async (req, res) => {
    //console.clear();
    const { firstName, lastName, email, mobile, password } = req.body;
    // || {
    //     firstName: "Ajinkya",
    //     lastName: "Salunke",
    //     email: "one@gmail.com",
    //     mobile: "8767564544",
    //     password: "1234567",
    // };

    try {
        // console.log(email);

        if (
            [firstName, lastName, email, mobile, password].some(
                (field) => !field || field.trim() === ""
            )
        ) {
            throw new ApiError(400, "Please fill all the fields");
        }

        const findUser = await User.findOne({
            $or: [{ mobile }, { email }],
        }).select("-password -_id -__v -createdAt -updatedAt");
        //console.log(findUser);
        if (findUser) {
            res.json(
                new ApiResponse(
                    200,
                    null,
                    "User with the same mobile No. & email already exists",
                    true
                )
            );
        } else {
            const newUser = await User.create({
                firstName,
                lastName,
                email,
                mobile,
                password,
            });
            // // res.json(newUser);
            // const createdUser = await User.findById(newUser._id).select(
            //     "-password -refreshToken"
            // );
            const createdUser = {
                email: newUser.email,
                mobile: newUser.mobile,
                role: newUser.role,
                // password: newUser.password,
            };
            res.json(
                new ApiResponse(200, createdUser, "User created successfully")
            );
        }
    } catch (error) {
        console.log(error);
    }
});

// Login user

export const loginUser = asyncHandler(async (req, res) => {
    const { email, mobile, password } = req.body;
    //console.log(email || "", mobile || "", password);

    try {
        if (!(mobile || email)) {
            throw new ApiError(401, "Mobile no. or email is required");
        }

        const findUser = await User.findOne({
            $or: [{ mobile }, { email }],
        }).select("-__v -createdAt -updatedAt");

        if (!findUser) {
            return res
                .status(401)
                .json(new ApiResponse(401, null, "User not found"));
        }

        const customData = {
            email: findUser.email,
            mobile: findUser.mobile,
            token: generateToken(findUser._id),
        };

        if (await findUser.isPasswordMatched(password)) {
            const refreshToken = await generateRefreshToken(findUser?._id);
            console.log(refreshToken);
            const updatedUser = await User.findByIdAndUpdate(
                findUser._id,
                {
                    refreshToken: refreshToken,
                },
                { new: true }
            );
            res.cookie("refresh");
            return res
                .status(200)
                .json(new ApiResponse(200, customData, "User found", true));
        } else {
            return res
                .status(401)
                .json(new ApiResponse(401, null, "Invalid credentials"));
        }
    } catch (error) {
        console.error(error);
        return res.status(error.code || 500).json({
            success: false,
            message: error.message,
        });
    }
});

// Update user email or phone

export const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoId(_id);
    // console.log("Update " + _id);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstName: req.body && req.body.firstName,
                lastName: req.body && req.body.lastName,
                email: req.body && req.body.email,
                mobile: req.body && req.body.mobile,
                //role: req.body && req.body.role,
            },
            {
                new: true,
            }
        ).select("-password -token");

        res.json(
            new ApiResponse(200, updatedUser, "user updated successfully")
        );
    } catch (error) {
        console.log(error);
        throw new Error(new ApiError(error.message));
    }
});

// Get all users

export const getAllUser = asyncHandler(async (req, res) => {
    //console.log("users");
    try {
        const getUsers = await User.find();
        res.json(new ApiResponse(200, getUsers, "Users fetched successfully"));
    } catch (error) {
        console.log(error);
        throw new Error(new ApiError(error.message));
    }
});

// get single user

export const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);
    //console.log(id);

    try {
        const getSingleUser = await User.findById(id).select("-password");
        if (getSingleUser) {
            res.json(
                new ApiResponse(200, getSingleUser, "User fetched successfully")
            );
            return getSingleUser;
        } else {
            res.json(new ApiResponse(404, null, "User not found", true));
        }
    } catch (error) {
        console.log(error);
        throw new Error(new ApiError(error.message));
    }
});

// Delete single user

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);
    //console.log(id);

    try {
        const deleteUser = await User.findByIdAndDelete(id);
        if (deleteUser) {
            res.json(
                new ApiResponse(200, deleteUser, "User deleted successfully")
            );
        } else {
            res.json(new ApiResponse(404, null, "User not found", true));
        }
    } catch (error) {
        console.log(error);
        throw new Error(new ApiError(error.message));
    }
});

//block user

export const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const vali = validateMongoId(id);
    console.log(vali);

    try {
        const blockUser = await User.findByIdAndUpdate(
            id,
            {
                isBlockedUser: true,
            },
            {
                new: true,
            }
        );
        if (blockUser) {
            res.json(new ApiResponse(200, null, "User blocked successfully"));
        } else {
            res.json(new ApiResponse(404, null, "User not found", true));
        }
    } catch (error) {
        console.log(error);
        throw new Error(new ApiError(error.message));
    }
});

// unblock user

export const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);

    try {
        const unblockUser = await User.findByIdAndUpdate(
            id,
            {
                isBlockedUser: false,
            },
            {
                new: true,
            }
        );
        if (unblockUser) {
            res.json(new ApiResponse(200, null, "User unblocked successfully"));
        } else {
            res.json(new ApiResponse(404, null, "User not found", true));
        }
    } catch (error) {
        console.log(error);
        throw new Error(new ApiError(error.message));
    }
});
