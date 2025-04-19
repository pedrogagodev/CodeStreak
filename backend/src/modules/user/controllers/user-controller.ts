import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { UserRepository } from "../repositories/user-repository";
import { getUserSchema } from "../schemas/get-user-schema";
import { UserService } from "../services/user-service";

export class UserController {
  constructor(private userService: UserService) {}

  getUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = getUserSchema.parse(request.query);
      const user = await this.userService.getUserByEmail(query.email);

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

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const userController = new UserController(userService);

export { userController };
