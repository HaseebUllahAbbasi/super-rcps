"use server";

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
    // In a real application, you would verify credentials against a database
    // This is a simplified example for demonstration purposes
    const { email, password } = data;

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Example validation (replace with actual authentication logic)
    // For demo purposes, we'll accept any email with password "Password123!"
    const isValidCredentials = password === "Password123!";

    if (!isValidCredentials) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Set authentication cookie (in a real app, use a secure JWT or session)
    const cookiesStore = await cookies();
    const oneDay = 24 * 60 * 60 * 1000;
    cookiesStore.set("auth-token", "example-secure-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: oneDay,
      path: "/",
    });

    return {
      success: true,
      user: {
        email,
        // Include other user data as needed
      },
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
  return {
    user: {
      email: "user@example.com",
    },
  };
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
