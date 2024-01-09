import { Router } from "express";
import { addMessage, getMessages } from "../controllers/message.controller.js";
import isLoggedIn from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(isLoggedIn, addMessage);
router.route("/get").get(isLoggedIn, getMessages);

export default router;
