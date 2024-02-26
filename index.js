import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import authRouter from "./routes/auth-route.js";
import bodyParser from "body-parser";
import { errorHandler, notFound } from "./middlewares/errorhandler.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser);

dotenv.config({
    path: "./.env",
});

dbConnect();
// app.use("/", (req, res) => {
//     res.send("Default route");
// });
app.use("/api/v1/user", authRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    try {
        console.log("Server listening on port :", PORT);
        console.log(`http://localhost:${PORT}/`);
    } catch (error) {
        console.log(error.message);
    }
});
