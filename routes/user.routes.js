import { Router } from "express";
import {
  loginUser,
  registerUser,
  checkUsername,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/checkusername").post(checkUsername);

export default router;
