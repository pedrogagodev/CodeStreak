import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Environment validation error:", _env.error.format());

  throw new Error("Environment validation error");
}

export const env = _env.data;
