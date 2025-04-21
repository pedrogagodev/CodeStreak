import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AuthRepository } from "../repositories/auth-repository";
import { registerSchema, loginSchema } from "../schemas/auth-schema";
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
}

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

const authController = new AuthController(authService);

export { authController };
