"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
