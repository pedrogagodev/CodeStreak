import verifyToken from "@/modules/auth/middlewares/auth-middleware";
import authRoutes from "@/modules/auth/routes/auth-routes";
import userRoutes from "@/modules/user/routes/user-routes";

import express, { type Express, type Request, type Response } from "express";

const setupRoutes = (app: Express) => {
  const {} = app.use(express.json());

  app.get("/server-test", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running!" });
  });
  app.use("/auth", authRoutes);
  app.use("/", verifyToken, userRoutes);
};

export { setupRoutes };
