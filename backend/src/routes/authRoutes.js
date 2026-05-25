import express from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/me", verifyToken, me);

export default router;
