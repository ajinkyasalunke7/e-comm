import jwt from "jsonwebtoken";
const generateToken = (id) => {
    // console.log(token);
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export default generateToken;
