import prisma from "@/lib/prisma";
import type { User } from "@prisma/client";
import type { IUserRepository } from "../interfaces/user";

export class UserRepository implements IUserRepository {
  getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
