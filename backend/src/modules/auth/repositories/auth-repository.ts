import prisma from "@/lib/prisma";
import type { User } from "@prisma/client";
import type { IAuthRepository, ICreateUser } from "../interfaces/auth";

export class AuthRepository implements IAuthRepository {
  findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(data: ICreateUser): Promise<User> {
    const { email, name, password } = data;

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    return user;
  }

}
