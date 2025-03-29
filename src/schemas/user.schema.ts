import { z } from "zod";

const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password is too long" }),
})
  

export {loginSchema}