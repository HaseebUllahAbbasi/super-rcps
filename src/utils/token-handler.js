"use server";

import { cookies } from "next/headers";

export async function setToken(token) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  console.log("Token stored in cookies.");
  console.log("Cookie Store", cookieStore);
  return { success: true, message: "Token stored in cookies." };
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");
  console.log("Get Token stored in cookies.", token);
  console.log("Cookie Store", cookieStore);
  return { success: true, token, message: "Token stored in cookies." };
}
