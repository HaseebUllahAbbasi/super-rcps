"use server";

import { loginAdmin } from "@/apis/auth-apis";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

// Define validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

type LoginData = z.infer<typeof loginSchema>;

export async function login(data: LoginData) {
  // Validate input data
  const validationResult = loginSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Invalid input data",
    };
  }

  try {
  
    // Simulate authentication delay
    const {data: response,error} =  await loginAdmin(data) 

    
    if (error) {
      return {
        success: false,
        error: error,
      };
    }
    
    console.log(response)
    
    if (!response?.success) {
      return {
        success: false,
        error: response?.message,
      };
      
    }
    
   

    // Set authentication cookie (in a real app, use a secure JWT or session)
    const cookiesStore = await cookies();
    const oneDay = 24 * 60 * 60 * 1000;
    cookiesStore.set("auth-token", response?.data?.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: oneDay,
      path: "/",
    });

    return {
      success: true,
      data: response?.data,
     statusCode: response?.statusCode
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Authentication failed",
    };
  }
}

export async function logout() {
  console.log("I am called ")
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/");
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  if (!token) {
    return null;
  }

  // In a real app, verify and decode the token
  // For demo purposes, we'll return a mock user
  return token;
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
