import { mongoose, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,

            trim: true,
        },
        lastName: {
            type: String,
            required: true,

            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user",
        },
        isBlockedUser: {
            type: Boolean,
            default: false,
        },
        cart: {
            type: Array,
            default: [],
        },
        address: [
            {
                type: Schema.Types.ObjectId,
                ref: "Address",
            },
        ],
        wishlist: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
export const User = mongoose.model("User", userSchema);
