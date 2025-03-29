import { z } from "zod";
import * as yup from "yup"
import { validAdminRoles, validDivisions } from "@/components/constants";

const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password is too long" }),
})



export const addAdminSchema = yup.object().shape({
  name: yup.string().min(3).max(50).required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().min(10).max(20).required("Phone is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: yup.string().oneOf(validAdminRoles, "Invalid role").required("Role is required"),
  division: yup.string().oneOf(validDivisions, "Invalid division").required("Division is required"),
});

export { loginSchema }