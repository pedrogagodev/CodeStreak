import authRoutes from "@/modules/auth/routes/auth-routes";
import express, { type Express, type Request, type Response } from "express";

const setupRoutes = (app: Express) => {
  const {} = app.use(express.json());

  app.get("/server-test", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running!" });
  });
  app.use("/auth", authRoutes);
};

export { setupRoutes };
