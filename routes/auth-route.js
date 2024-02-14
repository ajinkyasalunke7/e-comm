import { Router } from "express";
import {
    blockUser,
    createUser,
    deleteUser,
    getAllUser,
    getSingleUser,
    loginUser,
    unblockUser,
    updateUser,
} from "../controller/user-controller.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all-users", getAllUser);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete("/:id", deleteUser);
router.put("/update-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

export default router;
