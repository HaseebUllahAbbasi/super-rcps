import { validAdminRoles } from "@/components/constants";
import * as yup from "yup";
import { z } from "zod";

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
  phone: yup
  .string()
  .matches(/^(\d{4})-(\d{7})$/, "Phone number must be 11 digits")
  .required("Phone number is required"),
    cnic: yup.string().required("CNIC is required").matches(/^\d{5}-\d{7}-\d{1}$/,"CNIC must follow the format xxxxx-xxxxxxx-x"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: yup.string().oneOf(validAdminRoles, "Invalid role").required("Role is required"),
  division: yup.string().required("Division is required"),
});

export const updateAdminSchema = yup.object().shape({
  id: yup.number().required("ID is required"),
  name: yup.string().min(3).max(50).required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().min(10).max(20).required("Phone is required"),
  role: yup.string().oneOf(validAdminRoles, "Invalid role").required("Role is required"),
  division: yup.string().required("Division is required"),
});


export const changePasswordSchema = yup.object().shape({
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password"), undefined], "Passwords do not match").required("Confirm Password is required"),
});

export { loginSchema };
