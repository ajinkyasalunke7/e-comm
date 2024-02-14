import mongoose from "mongoose";

export const validateMongoId = (id) => {
    const isValid = mongoose.isValidObjectId(id);
    console.log(isValid);
    if (!isValid) throw new Error("Invalid Mongo Id");
};

// import { mongoose, Schema } from "mongoose";

// export const validateMongoId = (id) => {
//     if (!id) {
//         throw new Error("Missing Mongo ID");
//     }

//     if (typeof id !== "string") {
//         throw new Error("Invalid Mongo ID type: must be a string");
//     }

//     if (!Schema.Types.ObjectId.isValid(id)) {
//         throw new Error("Invalid Mongo ID format");
//     }

//     // Optional customization (example): Throw a more specific error if ID length is incorrect
//     if (id.length !== 24) {
//         throw new Error("Invalid Mongo ID length: must be 24 characters");
//     }

//     return true; // Optional: Return the validated ID if desired
// };
