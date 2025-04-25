import { Router } from "express";
import { authController } from "../controllers/auth-controller";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/token/refresh", authController.refreshToken);

export default authRouter;
