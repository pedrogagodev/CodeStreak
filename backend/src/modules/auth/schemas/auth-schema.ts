import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email({ message: "Please, provide your email" }),
  name: z.string().min(1, { message: "Please, provide your name" }),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Please, provide your email" }),
  password: z.string().min(1, { message: "Please, provide your password" }),
});
