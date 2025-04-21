import { z } from "zod";

export const getUserSchema = z.object({
  email: z.string().email({ message: "Please, provide your email" }),
});

