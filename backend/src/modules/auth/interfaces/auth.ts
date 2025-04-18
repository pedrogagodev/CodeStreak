import type { User } from "@prisma/client";

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  createUser(user: ICreateUser): Promise<User>;
}
