import verifyToken from "@/modules/auth/middlewares/auth-middleware";
import authRoutes from "@/modules/auth/routes/auth-routes";
import userRoutes from "@/modules/user/routes/user-routes";

import cors from "cors";
import express, { Router, type Express } from "express";

const setupRoutes = (app: Express) => {
  app.use(express.json());
  app.use(cors());

  const apiRouter = Router();

  apiRouter.use("/auth", authRoutes);

  apiRouter.use("/users", verifyToken, userRoutes); 

  app.use("/api", apiRouter);
};

export { setupRoutes };
