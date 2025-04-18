import { Router } from "express";
import { authController } from "../controllers/auth-controller";

const userRouter = Router();

userRouter.post("/register", authController.register);

export default userRouter;
