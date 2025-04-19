import { User } from "@prisma/client";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<User | null>;
}
