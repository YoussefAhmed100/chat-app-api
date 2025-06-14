import express from "express";
import { protectRoute } from "../middleWare/auth.middleWare.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../services/message.service.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;