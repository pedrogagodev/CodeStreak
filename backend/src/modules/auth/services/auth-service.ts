import { env } from "@/env";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IAuthRepository } from "../interfaces/auth";

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async register(data: { name: string; email: string; password: string }) {
    const userAlreadyExists = await this.authRepository.findUserByEmail(
      data.email
    );

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 8);

    const user = await this.authRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return {
      user: {
        ...user,
        password: null,
      },
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordCorrectly = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordCorrectly) {
      throw new Error("Password is incorrect");
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      env.AUTH_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      refreshToken,
      accessToken,
    };
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new Error("Token not provided");
    }

    const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET as string) as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = jwt.sign(
      { id: user.id },
      env.AUTH_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id },
      env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
