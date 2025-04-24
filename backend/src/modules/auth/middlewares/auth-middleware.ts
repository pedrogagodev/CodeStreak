import { env } from "@/env/index";
import prisma from "@/lib/prisma";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

async function verifyToken(
  request: AuthRequest,
  response: Response,
  next: NextFunction
) {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    response.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.AUTH_SECRET) as {
      id: string;
      email: string;
    };

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      response.status(403).json({ message: "Access denied" });
      return;
    }

    request.user = decoded;
    next();
  } catch (err) {
    response.status(401).json({ message: "Invalid or expired Token" });
    return;
  }
}

export default verifyToken;
