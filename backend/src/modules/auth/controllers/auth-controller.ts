import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AuthRepository } from "../repositories/auth-repository";
import { loginSchema, registerSchema } from "../schemas/auth-schema";
import { AuthService } from "../services/auth-service";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const body = registerSchema.parse(request.body);
      const user = await this.authService.register(body);

      response.status(201).send(user);
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({ errors: error.errors });
        return;
      }
      if (error instanceof Error) {
        response.status(409).json({ error: error.message });
        return;
      }
      next(error);
    }
  };

  login = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const body = loginSchema.parse(request.body);
      const user = await this.authService.login(body);

      response.status(200).send(user);
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({ errors: error.errors });
        return;
      }
      if (error instanceof Error) {
        response.status(409).json({ error: error.message });
        return;
      }
      next(error);
    }
  };

  refreshToken = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshToken = request.headers.authorization?.split(" ")[1];

      if (!refreshToken) {
        response.status(401).json({ message: "No token provided" });
        return;
      }

      const newTokens = await this.authService.refreshToken(refreshToken);

      response.status(200).json({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      });
      return;
    } catch (error) {
      if (error instanceof Error) {
        response.status(401).json({ error: error.message });
        return;
      }
      next(error);
    }
  };
}

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

const authController = new AuthController(authService);

export { authController };
